#!/usr/bin/env python3
"""Turn raw generated PNGs into web-ready WebP assets for the nikah invite.

usage:
  python3 prep_assets.py SRC_DIR OUT_DIR [--max 1400] [--only name1,name2]
                         [--bg-files bg-*,og-*] [--keep-frags] [--sheet contact.png]

What it does, per file:
  * Background images (names matching --bg-files, default "bg-*,og-*"):
      resized so the long side <= --max-bg (default 2000), saved as WebP q=80.
  * Everything else is treated as a cut-out:
      - if the PNG already has real transparency, it is used as is;
      - if it has a flat white (or near-white) background, the background that
        is reachable from the image border is made transparent with a soft 2px
        edge and white de-fringing (enclosed highlights inside petals survive);
      - a drawn grey/white CHECKERBOARD is detected and treated as background too;
      - stray fragments (pieces of neighbouring art) are dropped: keeps the
        largest blob plus small decorations (<4% of it), unless --keep-frags;
      - trimmed to content + 6px, resized so the long side <= --max, WebP q=86.
  * Writes a contact sheet on dark green so you can eyeball every result.
"""
import argparse, fnmatch, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--max', type=int, default=1400)
ap.add_argument('--max-bg', type=int, default=2000)
ap.add_argument('--only', default='')
ap.add_argument('--bg-files', default='bg-*,og-*')
ap.add_argument('--keep-frags', action='store_true')
ap.add_argument('--holes', type=int, default=0, help='also clear enclosed background regions >= N px (wreath centres)')
ap.add_argument('--sheet', default='_contact.png')
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
bg_pats = [p.strip() for p in a.bg_files.split(',') if p.strip()]
only = {s.strip() for s in a.only.split(',') if s.strip()}


def is_bg_name(name):
    return any(fnmatch.fnmatch(name, p) for p in bg_pats)


def cutout_from_flat(rgb):
    """rgb float32 HxWx3 -> alpha float32 HxW (0..1)."""
    mn, mx = rgb.min(2), rgb.max(2)
    chroma = mx - mn
    # neutral and bright = background candidate (white, or light grey checker squares)
    cand = (mn >= 200) & (chroma <= 14)
    lab, _ = ndi.label(cand)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    outside = np.isin(lab, border[border > 0])
    if a.holes:
        inner = cand & ~outside
        hl, hn = ndi.label(inner)
        if hn:
            hs = ndi.sum(inner, hl, index=np.arange(1, hn + 1))
            outside |= np.isin(hl, np.nonzero(hs >= a.holes)[0] + 1)
    alpha = (~outside).astype(np.float32)
    near = ndi.binary_dilation(outside, iterations=2) & ~outside
    bgness = np.clip((mn - 196) / 50, 0, 1) * np.clip(1 - chroma / 24, 0, 1)
    alpha = np.where(near, np.clip(1 - bgness * 0.95, 0, 1), alpha)
    return ndi.gaussian_filter(alpha, 0.6) * (alpha > 0)


def defringe(rgb, alpha, W=248.0):
    a3 = np.maximum(alpha, 1e-3)[..., None]
    col = np.clip((rgb - (1 - a3) * W) / a3, 0, 255)
    return np.where(alpha[..., None] > 0.02, col, 0)


def drop_fragments(alpha):
    m = alpha > 0.04
    lab, n = ndi.label(ndi.binary_dilation(m, iterations=2))
    if n <= 1:
        return alpha
    sizes = ndi.sum(m, lab, range(1, n + 1))
    big = int(np.argmax(sizes)) + 1
    objs = ndi.find_objects(lab)
    keep = [big]
    for i in range(1, n + 1):
        if i == big or sizes[i - 1] < 30 or sizes[i - 1] >= sizes.max() * 0.04:
            continue
        sl = objs[i - 1]; h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if min(h, w) > 6 and max(h, w) / max(min(h, w), 1) < 3.5:
            keep.append(i)
    return np.where(np.isin(lab, keep), alpha, 0)


def fit(im, limit):
    s = limit / max(im.size)
    return im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS) if s < 1 else im


tiles = []
for f in sorted(os.listdir(a.src)):
    if not f.lower().endswith(('.png', '.webp', '.jpg', '.jpeg')) or f.startswith('_'):
        continue
    stem = os.path.splitext(f)[0]
    if only and stem not in only:
        continue
    im = Image.open(os.path.join(a.src, f))
    dst = os.path.join(a.out, stem + '.webp')
    if is_bg_name(stem):
        out = fit(im.convert('RGB'), a.max_bg)
        out.save(dst, 'WEBP', quality=80, method=6)
    else:
        rgba = np.asarray(im.convert('RGBA')).astype(np.float32)
        rgb, alpha = rgba[..., :3], rgba[..., 3] / 255
        has_alpha = (alpha < 0.5).mean() > 0.02
        if not has_alpha:
            alpha = cutout_from_flat(rgb)
            rgb = defringe(rgb, alpha)
        if not a.keep_frags:
            alpha = drop_fragments(alpha)
        ys, xs = np.nonzero(alpha > 0.02)
        if not len(ys):
            print(f'!! {f}: nothing left after cut-out, skipped'); continue
        p = 6
        y0, y1 = max(ys.min() - p, 0), min(ys.max() + p + 1, alpha.shape[0])
        x0, x1 = max(xs.min() - p, 0), min(xs.max() + p + 1, alpha.shape[1])
        arr = np.dstack([rgb, alpha * 255])[y0:y1, x0:x1].astype(np.uint8)
        out = fit(Image.fromarray(arr, 'RGBA'), a.max)
        out.save(dst, 'WEBP', quality=86, method=6)
    kb = os.path.getsize(dst) // 1024
    print(f'{stem + ".webp":34s} {out.width}x{out.height}  {kb} KB' + ('  (bg)' if is_bg_name(stem) else ''))
    t = out.convert('RGBA'); t.thumbnail((220, 220)); tiles.append((stem, t))

if tiles:
    cols = 6
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * 230, rows * 250), (23, 54, 40, 255))
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    for i, (name, t) in enumerate(tiles):
        x, y = (i % cols) * 230 + 5, (i // cols) * 250 + 5
        sheet.alpha_composite(t, (x, y))
        d.text((x, y + 226), name[:32], fill=(244, 239, 227, 255))
    sheet.convert('RGB').save(os.path.join(a.out, a.sheet))
    print('contact sheet ->', os.path.join(a.out, a.sheet))
