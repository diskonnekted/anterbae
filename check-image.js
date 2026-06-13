const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('i:/anterbae/public/anterbae.png');
const png = PNG.sync.read(data);
let minX = png.width, minY = png.height, maxX = 0, maxY = 0;

for(let y = 0; y < png.height; y++){
  for(let x = 0; x < png.width; x++){
    const idx = (png.width * y + x) << 2;
    if(png.data[idx + 3] > 0){
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}
console.log('Actual logo bounds: x:'+minX+'-'+maxX+', y:'+minY+'-'+maxY+'. Size: '+(maxX-minX+1)+'x'+(maxY-minY+1));
