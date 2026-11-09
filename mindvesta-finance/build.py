#!/usr/bin/env python3
"""Rakit src/ -> dist/index.html (satu berkas, siap offline) + salin aset PWA.
Pakai:  python3 build.py        (hasil di dist/)"""
import re,os,shutil,sys
R=os.path.dirname(os.path.abspath(__file__))
t=open(f'{R}/src/index.template.html',encoding='utf-8').read()
def inc(m):
    return open(f'{R}/src/{m.group(1)}',encoding='utf-8',newline='').read()
out=re.sub(r'\{\{inc:([^}]+)\}\}',inc,t)
os.makedirs(f'{R}/dist',exist_ok=True)
open(f'{R}/dist/index.html','w',encoding='utf-8',newline='').write(out)
for f in ('manifest.webmanifest','sw.js'):
    if os.path.exists(f'{R}/src/{f}'): shutil.copy(f'{R}/src/{f}',f'{R}/dist/{f}')
if os.path.isdir(f'{R}/src/icons'):
    shutil.rmtree(f'{R}/dist/icons',ignore_errors=True); shutil.copytree(f'{R}/src/icons',f'{R}/dist/icons')
print('dist/index.html',len(out),'bytes')
