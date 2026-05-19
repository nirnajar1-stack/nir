import { COLORS } from './data.js';

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '148, 163, 184';
};

export const getHeatmapBg = (val, mainCat) => {
  if (!val || val === 0) return 'rgba(241, 245, 249, 0.4)';
  const baseColor = COLORS[mainCat] || '#94a3b8';
  const opacity = Math.min(0.08 + (val / 60) * 0.75, 0.85);
  return `rgba(${hexToRgb(baseColor)}, ${opacity})`;
};

export const getContinuityClassification = (jan, feb, mar, apr) => {
  const values = [jan || 0, feb || 0, mar || 0, apr || 0];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const mean = values.reduce((a, b) => a + b, 0) / 4;
  const sum = values.reduce((a, b) => a + b, 0);

  if (sum > 15 && max / sum > 0.55) {
    return {
      label: '\u05e4\u05d9\u05e7 \u05d7\u05e8\u05d9\u05d2 (Spike)',
      color: 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm',
      desc: '\u05de\u05e9\u05d9\u05de\u05d4 \u05d4\u05de\u05d0\u05d5\u05e4\u05d9\u05d9\u05e0\u05ea \u05d1\u05d4\u05ea\u05e4\u05e8\u05e6\u05d5\u05ea \u05e0\u05e7\u05d5\u05d3\u05ea\u05d9\u05ea \u05d7\u05d3-\u05d7\u05d5\u05d3\u05e9\u05d9\u05ea \u05d5\u05dc\u05d0 \u05d1\u05e2\u05d5\u05de\u05e1 \u05e9\u05d5\u05d8\u05e3 \u05e7\u05d1\u05d5\u05e2.',
    };
  }
  if (mean >= 20) {
    return {
      label: '\u05e7\u05d1\u05d5\u05e2 \u05d5\u05e2\u05de\u05d5\u05e1 (Core High)',
      color: 'bg-rose-100 text-rose-900 border-rose-300 shadow-sm',
      desc: '\u05de\u05e9\u05d9\u05de\u05ea \u05dc\u05d9\u05d1\u05d4 \u05d4\u05de\u05d9\u05d9\u05e6\u05e8\u05ea \u05e2\u05d5\u05de\u05e1 \u05e7\u05d1\u05d5\u05e2, \u05e9\u05d5\u05d7\u05e7 \u05d5\u05d2\u05d1\u05d5\u05d4 \u05d1\u05db\u05dc \u05d7\u05d5\u05d3\u05e9\u05d9 \u05d4\u05e4\u05e2\u05d9\u05dc\u05d5\u05ea.',
    };
  }
  if (min >= 1 && max - min <= 5) {
    return {
      label: '\u05e7\u05d1\u05d5\u05e2 \u05d5\u05d9\u05e6\u05d9\u05d1 (Stable Low)',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-sm',
      desc: '\u05e4\u05e2\u05d9\u05dc\u05d5\u05ea \u05e9\u05d2\u05e8\u05ea\u05d9\u05ea \u05e8\u05e6\u05d9\u05e4\u05d4 \u05d1\u05e0\u05e4\u05d7 \u05e7\u05d8\u05df \u05d0\u05da \u05d9\u05e6\u05d9\u05d1, \u05dc\u05dc\u05d0 \u05e2\u05dc\u05d9\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d5\u05ea.',
    };
  }
  return {
    label: '\u05ea\u05e0\u05d5\u05d3\u05ea\u05d9 / \u05de\u05d6\u05d3\u05de\u05df (Variable)',
    color: 'bg-blue-100 text-blue-900 border-blue-300 shadow-sm',
    desc: '\u05de\u05e9\u05d9\u05de\u05d4 \u05d4\u05de\u05e9\u05ea\u05e0\u05d4 \u05de\u05e2\u05ea \u05dc\u05e2\u05ea \u05d1\u05d4\u05ea\u05d0\u05dd \u05dc\u05e6\u05e8\u05db\u05d9\u05dd \u05d0\u05d3-\u05d4\u05d5\u05e7 \u05e0\u05e7\u05d5\u05d3\u05ea\u05d9\u05d9\u05dd.',
  };
};
