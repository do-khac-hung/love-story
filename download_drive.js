/**
 * Google Drive folder downloader — parses embedded JSON from Drive HTML page
 * Folder: 1Dyq1qyICWEor35SmPTPr1pg0QjdynY3C
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const FOLDER_ID = '1Dyq1qyICWEor35SmPTPr1pg0QjdynY3C';
const OUT_DIR   = path.join('D:\\working\\naomi\\images\\my_img\\oct25');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/118 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        ...(options.headers || {}),
      },
      ...options,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, options).then(resolve).catch(reject);
      }
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
  });
}

async function downloadFile(fileId, filename) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
  console.log(`  Downloading ${filename} ...`);
  const res = await fetchUrl(url);
  if (res.status === 200) {
    const dest = path.join(OUT_DIR, filename);
    fs.writeFileSync(dest, res.body);
    console.log(`  ✓ Saved ${filename} (${res.body.length} bytes)`);
    return true;
  }
  console.log(`  ✗ Failed ${filename} — status ${res.status}`);
  return false;
}

async function listFolder(folderId) {
  const url = `https://drive.google.com/drive/folders/${folderId}`;
  console.log(`Fetching folder page...`);
  const res = await fetchUrl(url);
  const html = res.body.toString('utf8');

  // Drive embeds file data in multiple JSON-like structures
  // Pattern 1: look for file IDs with their names in the "AF_initDataCallback" blocks
  const fileIds = [];

  // Try to match file entries: usually ["FILE_ID", null, "filename.jpg", ...]
  const pattern1 = /"([\w-]{25,})",null,"([^"]+\.(?:jpg|jpeg|png|webp|heic|mp4))"/gi;
  let m;
  while ((m = pattern1.exec(html)) !== null) {
    fileIds.push({ id: m[1], name: m[2] });
  }

  // Pattern 2: broader capture inside nested arrays
  if (fileIds.length === 0) {
    const pattern2 = /\["([\w-]{25,})",\s*null,\s*"([^"]+)"\s*,\s*null,\s*null,\s*"image\//gi;
    while ((m = pattern2.exec(html)) !== null) {
      fileIds.push({ id: m[1], name: m[2] });
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = fileIds.filter(f => {
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });

  console.log(`Found ${unique.length} image files in folder.`);
  console.log(unique.map(f => `  ${f.id} → ${f.name}`).join('\n'));

  // Write debug HTML for inspection
  fs.writeFileSync(path.join(OUT_DIR, '_drive_page.html'), html);
  console.log(`\nDebug HTML saved to: ${path.join(OUT_DIR, '_drive_page.html')}`);

  return unique;
}

(async () => {
  try {
    const files = await listFolder(FOLDER_ID);
    if (files.length === 0) {
      console.log('\nNo files found. The folder may require Google sign-in.');
      console.log('Please download photos manually from:');
      console.log(`  https://drive.google.com/drive/folders/${FOLDER_ID}`);
      console.log(`And save them to: ${OUT_DIR}`);
      return;
    }
    let ok = 0;
    for (const f of files) {
      const success = await downloadFile(f.id, f.name);
      if (success) ok++;
    }
    console.log(`\nDone: ${ok}/${files.length} files downloaded to ${OUT_DIR}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
