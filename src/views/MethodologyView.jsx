import SectionIcon from '../components/ui/SectionIcon.jsx';
import { LABELS } from '../data.js';

const SECTIONS = [
  {
    icon: 'target',
    title: 'מטרת הניתוח',
    body: 'לוח הבקרה מאגד נתוני מענים מינואר עד אפריל, ומאפשר להבחין בין עומס רוחבי (הרבה משפחות) לעומס נקודתי (מעט משפחות עם הרבה משימות). המטרה היא לתמוך בהחלטות תפעוליות וניהוליות מבוססות נתונים.',
  },
  {
    icon: 'dataset',
    title: 'מקורות ותקופה',
    body: 'הנתונים מבוססים על רישום משימות ומשפחות בטיפול לפי קטגוריות ראשיות ותתי-סיווג. תקופת הניתוח העיקרית: ינואר–אפריל. פילוח המתכללים מתייחס לחודש ינואר בלבד.',
  },
  {
    icon: 'calculate',
    title: 'הגדרות מדדים',
    items: [
      { term: 'משפחות', desc: 'מספר משפחות ייחודיות בטיפול בתקופה הנבחרת.' },
      { term: 'משימות', desc: 'מספר הפעולות / הפניות שנפתחו וטופלו במערכת.' },
      { term: 'SLA (ימי טיפול)', desc: 'משך זמן ממוצע לסגירת מעגל טיפול במענה.' },
      { term: 'יחס עצימות', desc: 'משימות ÷ משפחות. מעל 1.8 = מורכבות קיצונית; ~1.5 = עומס ממוצע; קרוב ל-1 = שירות חלק.' },
    ],
  },
  {
    icon: 'grid_view',
    title: 'מטריצת החלטות (2D / 3D)',
    body: 'המטריצה ממקמת כל תת-מענה לפי תפוצה (ציר X), מאמץ תפעולי (ציר Y) ונפח משימות (ציר Z בתלת-מימד). רביע "העברת שרביט" מסמן תהליכים שדורשים מינוי רפרנט מקצועי.',
  },
  {
    icon: 'route',
    title: 'מבנה הלוח',
    items: [
      { term: 'תפוצה לעומת עצימות', desc: 'מפת חום וניתוח יחס משימות/משפחות לפי חודש.' },
      { term: 'טבלת פיזור מורחבת', desc: 'השוואה חודשית מפורטת לכל תת-סיווג.' },
      { term: 'מטריצת החלטות', desc: 'תצוגה דו-מימדית או תלת-מימדית לזיהוי חריגים.' },
      { term: 'פילוח כללי', desc: 'סיכום עומסים לפי קטגוריות ראשיות ותתי-סיווג מובילים.' },
      { term: 'מתכללים', desc: 'פילוח עומסים, מפת חום ו-DNA עבודה לפי רכז/ת.' },
    ],
  },
];

export default function MethodologyView() {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="zen-card-elevated border border-outline-variant/15">
        <div className="flex items-start gap-4">
          <SectionIcon name="menu_book" className="!h-12 !w-12" />
          <div>
            <h2 className="text-xl font-semibold text-on-surface">מתודולוגיית הניתוח</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant max-w-prose">
              מסמך זה מסביר כיצד נאספו הנתונים, אילו מדדים מוצגים בלוח הבקרה, וכיצד מומלץ לקרוא את
              התצוגות לפני קבלת החלטות.
            </p>
          </div>
        </div>
      </div>

      {SECTIONS.map((section) => (
        <section
          key={section.title}
          className="zen-card border border-outline-variant/15"
        >
          <div className="mb-4 flex items-center gap-3">
            <SectionIcon name={section.icon} />
            <h3 className="text-lg font-semibold text-primary">{section.title}</h3>
          </div>

          {section.body ? (
            <p className="text-sm leading-relaxed text-on-surface-variant max-w-prose">{section.body}</p>
          ) : null}

          {section.items ? (
            <ul className="mt-2 space-y-3">
              {section.items.map((item) => (
                <li
                  key={item.term}
                  className="border-r-2 border-primary-container bg-surface-container-low px-4 py-3"
                >
                  <p className="text-sm font-semibold text-on-surface">{item.term}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{item.desc}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <div className="border border-outline-variant/20 bg-primary-container/30 px-5 py-4 text-sm text-on-primary-container">
        <span className="font-semibold text-primary">הערה: </span>
        {LABELS.decisionBody}
      </div>
    </div>
  );
}
