const heicConvert = require('heic-convert');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'images', 'my_img', 'oct25');

async function convertAll() {
  const files = fs.readdirSync(dir).filter(f => f.toUpperCase().endsWith('.HEIC'));
  console.log(`Found ${files.length} HEIC files to convert...`);
  
  for (const file of files) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(/\.HEIC$/i, '.jpg'));
    
    if (fs.existsSync(output)) {
      console.log(`[SKIP] ${file} -> already converted`);
      continue;
    }
    
    try {
      const inputBuffer = fs.readFileSync(input);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.85
      });
      fs.writeFileSync(output, Buffer.from(outputBuffer));
      console.log(`[OK]   ${file} -> ${path.basename(output)}`);
    } catch (err) {
      console.error(`[ERR]  ${file}: ${err.message}`);
    }
  }
  console.log('Done!');
}

convertAll();
