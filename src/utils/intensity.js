export function getIntensityClassification(families, tasks) {
  if (families === 0 || tasks === 0) {
    return {
      label: 'ללא פעילות',
      ratio: '—',
      color: 'bg-surface-container text-on-surface-variant border-outline-variant/30',
      desc: 'אין נתוני פעילות בתקופה.',
    };
  }
  const ratio = tasks / families;
  if (ratio > 1.8) {
    return {
      label: 'מורכבות קיצונית',
      ratio: ratio.toFixed(1),
      color: 'bg-yellow-100 text-yellow-900 border-yellow-400',
      desc:
        'נפח משימות גבוה ביחס למשפחות בטיפול — מצביע על צורך בייעול תהליך או במענה ממוקד יותר.',
    };
  }
  if (ratio > 1.3) {
    return {
      label: 'עומס ממוצע',
      ratio: ratio.toFixed(1),
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'מעט משימות פתוחות במקביל לכל משפחה בטיפול.',
    };
  }
  return {
    label: 'שירות חלק וישיר',
    ratio: ratio.toFixed(1),
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'כמעט משימה אחת לכל משפחה בטיפול (יחס קרוב ל־1:1).',
  };
}
