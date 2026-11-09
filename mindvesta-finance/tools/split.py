#!/usr/bin/env python3
"""Pecah index lama (satu berkas) menjadi src/ (template + css/ + js/). Lossless: build.py harus menghasilkan berkas identik."""
import re,sys,os
src,out=sys.argv[1],sys.argv[2]
h=open(src,encoding='utf-8').read()
pos=0;tpl=[];n={'css':0,'js':0};names=set()
pat=re.compile(r'<(script|style)\b([^>]*)>',re.I)
while True:
    m=pat.search(h,pos)
    if not m: tpl.append(h[pos:]);break
    tag,attrs=m.group(1).lower(),m.group(2)
    end=h.find('</'+tag+'>',m.end())
    if end<0: raise SystemExit('tag tidak ditutup')
    if tag=='script' and 'src=' in attrs:      # script eksternal: biarkan di template
        tpl.append(h[pos:end+len(tag)+3]);pos=end+len(tag)+3;continue
    body=h[m.end():end]
    kind='css' if tag=='style' else 'js'
    n[kind]+=1
    idm=re.search(r'\bid="([^"]+)"',attrs)
    base=(idm.group(1) if idm else 'inline')
    base=re.sub(r'[^a-z0-9_-]+','-',base.lower())
    fn=f'{n[kind]:02d}-{base}.{kind}'
    open(f'{out}/src/{kind}/{fn}','w',encoding='utf-8',newline='').write(body)
    tpl.append(h[pos:m.end()]+'{{inc:'+kind+'/'+fn+'}}'+'</'+tag+'>')
    pos=end+len(tag)+3
open(f'{out}/src/index.template.html','w',encoding='utf-8',newline='').write(''.join(tpl))
print('css',n['css'],'js',n['js'])
