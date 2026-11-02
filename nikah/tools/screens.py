#!/usr/bin/env python3
"""Screenshot a page top-to-bottom on phone + desktop for visual review.

usage: python3 screens.py URL OUT_DIR
  e.g. (from repo root)  python3 -m http.server 8765 &
                          python3 nikah/tools/screens.py "http://localhost:8765/nikah/v4/?to=Budi" /tmp/shots
Prints console errors and failed requests. Uses wait_until='load' (Firestore keeps
connections open, so 'networkidle' never settles). Clicks #openBtn to lift the cover.
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

URL, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)


async def main():
    async with async_playwright() as p:
        kw = {}
        if os.path.exists('/opt/pw-browsers/chromium'):
            kw['executable_path'] = '/opt/pw-browsers/chromium'
        b = await p.chromium.launch(**kw)
        problems = []
        for name, vp in (('phone', {'width': 390, 'height': 844}), ('desktop', {'width': 1440, 'height': 900})):
            pg = await b.new_page(viewport=vp, device_scale_factor=2 if name == 'phone' else 1)
            pg.on('pageerror', lambda e: problems.append(f'pageerror: {e}'))
            pg.on('console', lambda m: m.type == 'error' and problems.append(f'console: {m.text}'))
            pg.on('response', lambda r: r.status >= 400 and problems.append(f'HTTP {r.status} {r.url}'))
            await pg.goto(URL, wait_until='load')
            await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f'{OUT}/{name}-00-cover.png')
            await pg.click('#openBtn')
            await pg.wait_for_timeout(2500)
            h = await pg.evaluate('document.documentElement.scrollHeight')
            y, i = 0, 1
            while y < h:
                await pg.evaluate(f'window.scrollTo(0,{y})')
                await pg.wait_for_timeout(1800)
                await pg.screenshot(path=f'{OUT}/{name}-{i:02d}.png')
                y += int(vp['height'] * 0.9); i += 1
            print(f'{name}: page height {h}px, {i} shots')
        await b.close()
        print('\n'.join(problems) if problems else 'no errors')

asyncio.run(main())
