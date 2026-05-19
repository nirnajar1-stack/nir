import { LABELS } from '../../data.js';

const TICKER_ITEMS = [
  { highlight: true, text: `${LABELS.appTitle}: ניתוח מענים מאוחד ינואר–אפריל` },
  { highlight: false, text: 'הקצאת משאבים: מעבר לפילוח לפי מתכללים הושלם' },
  { highlight: false, text: 'אסטרטגיה: דגש על בירוקרטיה וזכויות ולוגיסטיקה דיגיטלית' },
];

export default function NewsTicker() {
  const renderItems = () =>
    TICKER_ITEMS.map((item, i) => (
      <span
        key={i}
        className={`flex items-center gap-2 font-medium tracking-widest uppercase text-[10px] shrink-0 ${
          item.highlight ? 'text-primary' : 'text-on-surface-variant'
        }`}
      >
        <span className={`w-1 h-1 rounded-full ${item.highlight ? 'bg-primary' : 'bg-outline-variant'}`} />
        {item.text}
      </span>
    ));

  return (
    <div className="mb-12 relative overflow-hidden border-b border-outline-variant/15 pb-2">
      <div className="news-ticker-scroll">
        <div className="flex gap-16 items-center pl-16">{renderItems()}</div>
        <div className="flex gap-16 items-center pl-16">{renderItems()}</div>
      </div>
    </div>
  );
}
