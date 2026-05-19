import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const analyticsHtml = 'c:/Users/nirn/Downloads/ניתוח מענים (משימות) ינואר -מאי 26.html';
const coordinatorHtml = 'c:/Users/nirn/Downloads/מענים ינואר 26.html';

function extractBlock(src, name) {
  const re = new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n\\]);`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not find ${name}`);
  return m[1];
}

const aSrc = fs.readFileSync(analyticsHtml, 'utf8');
const cSrc = fs.readFileSync(coordinatorHtml, 'utf8');

const mainCategoryData = extractBlock(aSrc, 'mainCategoryData');
const subCategoryData = extractBlock(aSrc, 'subCategoryData');
const coordinators = extractBlock(cSrc, 'coordinators');
const rawData = extractBlock(cSrc, 'rawData');
const categories = extractBlock(cSrc, 'categories');

const outDir = path.join(root, 'src/data');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'analyticsData.js'),
  `export const mainCategoryData = ${mainCategoryData};\n\nexport const subCategoryData = ${subCategoryData};\n`,
  'utf8'
);

fs.writeFileSync(
  path.join(outDir, 'coordinatorData.js'),
  `export const coordinators = ${coordinators};\n\nexport const categories = ${categories};\n\nexport const rawData = ${rawData.replace(/^const rawData/, 'export const rawData')};\n`.replace('export export', 'export'),
  'utf8'
);

console.log('Extracted analytics + coordinator data to src/data/');
