import sys,glob,os
from PIL import Image, ImageDraw
tag, per, W, maxh = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
files = sorted(glob.glob(f'out/{tag}_*.png'), key=lambda f: (f.split('_',1)[1][0], os.path.getmtime(f)))
for si in range(0, len(files), per):
    chunk = files[si:si+per]; tiles=[]
    for f in chunk:
        im = Image.open(f).convert('RGB'); sc = W/im.width; im = im.resize((W, int(im.height*sc)))
        im = im.crop((0,0,W,min(im.height,maxh))); d=ImageDraw.Draw(im); n=os.path.basename(f)[len(tag)+1:-4]
        d.rectangle((0,0,len(n)*7+8,16),fill=(0,0,0)); d.text((4,2),n,fill=(255,255,0)); tiles.append(im)
    H=max(t.height for t in tiles); c=Image.new('RGB',(len(tiles)*(W+8),H),(80,80,80))
    for i,t in enumerate(tiles): c.paste(t,(i*(W+8),0))
    c.save(f'sheet_{tag}_{si//per}.png'); print(f'sheet_{tag}_{si//per}.png', [os.path.basename(x) for x in chunk])
