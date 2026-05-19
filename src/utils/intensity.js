export function getIntensityClassification(families, tasks) {
  if (families === 0 || tasks === 0) {
    return {
      label: '\u05dc\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea',
      ratio: '\u2014',
      color: 'bg-slate-100 text-slate-500 border-slate-200',
      desc: '\u05d0\u05d9\u05df \u05e0\u05ea\u05d5\u05e0\u05d9 \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea \u05d1\u05ea\u05e7\u05d5\u05e4\u05d4.',
    };
  }
  const ratio = tasks / families;
  if (ratio > 1.8) {
    return {
      label: '\u05de\u05d5\u05e8\u05db\u05d1\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05ea',
      ratio: ratio.toFixed(1),
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: '\u05de\u05e1\u05e4\u05e8 \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05d2\u05d1\u05d5\u05d4 \u05dc\u05de\u05e9\u05e4\u05d7\u05d4 - \u05de\u05e2\u05d9\u05d3 \u05e2\u05dc \"\u05e4\u05d9\u05e0\u05d2-\u05e4\u05d5\u05e0\u05d2\" \u05d0\u05d5 \u05d8\u05d9\u05e4\u05d5\u05dc \u05e9\u05d0\u05d9\u05e0\u05d5 \u05e0\u05e1\u05d2\u05e8.',
    };
  }
  if (ratio > 1.3) {
    return {
      label: '\u05e2\u05d5\u05de\u05e1 \u05de\u05de\u05d5\u05e6\u05e2',
      ratio: ratio.toFixed(1),
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: '\u05de\u05e2\u05d8 \u05de\u05e2\u05d2\u05dc\u05d9\u05dd \u05e4\u05ea\u05d5\u05d7\u05d9\u05dd \u05d1\u05de\u05e7\u05d1\u05d9\u05dc \u05dc\u05de\u05e9\u05e4\u05d7\u05d4.',
    };
  }
  return {
    label: '\u05e9\u05d9\u05e8\u05d5\u05ea \u05d7\u05dc\u05e7 \u05d5\u05d9\u05e9\u05d9\u05e8',
    ratio: ratio.toFixed(1),
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: '\u05db\u05de\u05e2\u05d8 \u05db\u05dc \u05de\u05e9\u05d9\u05de\u05d4 \u05de\u05d9\u05d9\u05e6\u05e2\u05ea \u05de\u05e9\u05e4\u05d7\u05d4 \u05e9\u05d5\u05e0\u05d4 (\u05d9\u05d7\u05e1 1:1).',
  };
}
