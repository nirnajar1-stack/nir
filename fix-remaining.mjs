import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const appPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/App.jsx');
let lines = fs.readFileSync(appPath, 'utf8').split('\n');

// Remove orphan lines after matrixDesc
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('matrixDescAfter')) {
    while (lines[i + 1] && !lines[i + 1].includes('Toggle') && !lines[i + 1].trim().startsWith('{/*')) {
      if (lines[i + 1].includes('</div>') && !lines[i + 1].includes('</p>')) break;
      lines.splice(i + 1, 1);
    }
    break;
  }
}

for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const prev2 = lines[i - 2] || '';
  const prev1 = lines[i - 1] || '';

  if (l.includes('text-sm text-slate-500') && l.includes('<p') && !l.includes('LABELS')) {
    if (prev2.includes('overviewMain') || prev1.includes('overviewMain')) {
      lines[i] = '              <p className="text-sm text-slate-500">{LABELS.overviewMainDesc}</p>';
    } else if (prev2.includes('emerald') || prev1.includes('emerald')) {
      lines[i] = '              <p className="text-sm text-slate-500">{LABELS.overviewSubDesc}</p>';
    }
  }

  if (l.includes('<h2') && l.includes('text-xl font-bold') && !l.includes('LABELS')) {
    if (prev2.includes('emerald') || prev1.includes('emerald')) {
      lines[i] = '                <h2 className="text-xl font-bold text-slate-800">{LABELS.overviewSub}</h2>';
    }
  }

  if (l.includes('formatter={(value) =>') && !l.includes('LABELS')) {
    if (lines[i - 1]?.includes('avgSla')) {
      lines[i] = '                      formatter={(value) => `${value} ${LABELS.days}`}';
    } else {
      lines[i] = '                      formatter={(value) => `${value} ${LABELS.dayShort}`}';
    }
  }

  if (l.includes('text-2xl font-black text-slate-100') && !l.includes('LABELS')) {
    lines[i] = '                <h2 className="text-2xl font-black text-slate-100">{LABELS.fullscreenTitle}</h2>';
  }

  if (l.includes('text-sm text-slate-400') && !l.includes('LABELS')) {
    lines[i] = '                <p className="text-sm text-slate-400">{LABELS.fullscreenDesc}</p>';
  }

  if (l.includes('border-l border-slate-200 pl-4 ml-2') && !l.includes('LABELS')) {
    lines[i] = '        <span className="text-slate-500 font-medium text-sm border-l border-slate-200 pl-4 ml-2">{LABELS.legend}</span>';
  }
}

fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log('fix-remaining done');
