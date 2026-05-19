import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const p = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/components/Interactive3DChart.jsx');
const lines = fs.readFileSync(p, 'utf8').split('\n');

const block = [
  '        <motion.div className="flex items-center gap-2">',
  '          <motion.div className="w-3 h-0.5 bg-red-500"></motion.div>',
  '          <span>{LABELS.axisX}</span>',
  '        </motion.div>',
  '        <motion.div className="flex items-center gap-2">',
  '          <motion.div className="w-3 h-0.5 bg-green-500"></motion.div>',
  '          <span>{LABELS.axisY}</span>',
  '        </motion.div>',
  '        <motion.div className="flex items-center gap-2">',
  '          <motion.div className="w-3 h-0.5 bg-blue-500"></motion.div>',
  '          <span>{LABELS.axisZ}</span>',
  '        </motion.div>',
].map((l) => l.replace(/motion\.div/g, 'div'));

// Replace lines 244-255 (index 243-254) - 12 lines
lines.splice(243, 12, ...block);

fs.writeFileSync(p, lines.join('\n'), 'utf8');
console.log('chart lines fixed');
