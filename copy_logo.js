import fs from 'fs';
import path from 'path';
const searchPaths = [
  'C:\\Users\\User\\.gemini\\antigravity\\brain\\9fdbade2-bbd8-4a22-b69d-548ee06b93d5\\.system_generated\\attachments',
  'C:\\Users\\User\\.gemini\\antigravity\\attachments'
];

let latestFile = null;
let latestTime = 0;

function findLatest(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    if (f.endsWith('.png')) {
      const p = path.join(dir, f);
      const stat = fs.statSync(p);
      if (stat.mtimeMs > latestTime) {
        latestTime = stat.mtimeMs;
        latestFile = p;
      }
    }
  });
}

searchPaths.forEach(findLatest);

if (latestFile) {
  fs.copyFileSync(latestFile, path.join(process.cwd(), 'public', 'logo.png'));
  console.log('Copied ' + latestFile);
} else {
  console.log('No PNG found in attachments');
}
