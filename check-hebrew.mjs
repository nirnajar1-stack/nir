import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src');

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?)$/.test(f)) {
      const lines = fs.readFileSync(p, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (/>\s*\?/.test(line)) console.log('GARBLED?', `${p}:${i + 1}`);
        if (/[Ã×â€]/.test(line)) console.log('MOJIBAKE', `${p}:${i + 1}`, line.trim().slice(0, 60));
      });
    }
  }
}
walk(root);

const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist/assets');
const js = fs.readdirSync(distDir).find((f) => f.endsWith('.js'));
const bundle = fs.readFileSync(path.join(distDir, js), 'utf8');
console.log('title OK:', bundle.includes('\u05dc\u05d5\u05d7 \u05d1\u05e7\u05e8\u05d4'));
console.log('close OK:', bundle.includes('\u05e1\u05d2\u05d5\u05e8 \u05de\u05e1\u05da \u05de\u05dc\u05d0'));
