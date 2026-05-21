import SectionIcon from '../components/ui/SectionIcon.jsx';
import { COLORS, LABELS } from '../data.js';

const METHODOLOGY_PILLARS = [
  {
    icon: 'database',
    title: 'מקור הנתונים וגבולות הגזרה',
    body:
      'משימות שנפתחו בסיילפורס מינואר 2026 עד תחילת מאי 2026, כולל משפחות משרד הביטחון.',
  },
  {
    icon: 'assignment_ind',
    title: 'שיוך ואחריות מקצועית',
    body: 'לכל משימה יש שיוך למתכלל בתקופת בעלות המשפחה בעת פתיחתה.',
  },
  {
    icon: 'filter_alt',
    title: 'טיוב סיווגים (Taxonomy)',
    body:
      'קטגוריות (סוגי מענים) סווגו ודייקו מול תיאור ופירוט המשימה — לא לפי סיווג ותת־סיווג ששוייך על־ידי פותח המשימה. יש חפיפה גבוהה, אך סוג המענה שוכתב מחדש לצורך הניתוח הזה.',
  },
  {
    icon: 'forum',
    title: 'מדד תגובתיות ואופרציה',
    body:
      'משימות בהן נגעו אופרטיבי (צוות מענים) ומשרדי ממשלה — נספר לפי האם הייתה לפחות התייחסות אחת בתוך הצ׳אט של המשימה.',
  },
];

/** תת־נושאים ודוגמאות אותנטיות — כפי שבמקור */
const TAXONOMY_BLOCKS = [
  {
    key: 'bureau',
    title: 'בירוקרטיה וזכויות',
    icon: 'gavel',
    colorKey: 'בירוקרטיה וזכויות',
    items: [
      {
        label: 'ייצוג וסיוע מול רשויות וגופים',
        examples: [
          'אביתר דוד — שואל בעניין זכאותו לכרטיס "חבר"',
          'ביטול דו״ח חנייה בעיריית תל אביב',
        ],
      },
      {
        label: 'מסמכים ותעודות ממשלתיות',
        examples: ['בקשה לתו נכה', 'אגרת רכב'],
      },
      {
        label: 'סיוע משפטי',
        examples: ['אבישי דוד — סיוע משפטי מיצוי זכויות…', 'ערעור על בטל״א'],
      },
      {
        label: 'הסדרת העסקת עובד זר',
        examples: ['בירור שילוב של עובד זר לקראת ולאחר ניתוח…'],
      },
    ],
  },
  {
    key: 'health',
    title: 'בריאות ורווחה',
    icon: 'medical_services',
    colorKey: 'בריאות ורווחה',
    items: [
      {
        label: 'חוסן ורווחה',
        examples: ['סדנת מיינדפולנס', 'הנצחת רונן — כלים וסיוע'],
      },
      {
        label: 'סיוע רפואי',
        examples: ['טיפול שיניים', 'אבחון עבור אביגיל פלטי'],
      },
      {
        label: 'תורים רפואיים',
        examples: ['הקדמת תור ל־CT בבית חולים סורוקה'],
      },
    ],
    secondaryTitle: 'לוגיסטיקה ודיגיטל',
    secondaryIcon: 'flight',
    secondaryColorKey: 'לוגיסטיקה ודיגיטל',
    secondaryItems: [
      {
        label: 'מוניות והסעות',
        examples: ['הזמנת מונית חזור אירוע פרידה 22.2'],
      },
      {
        label: 'תמיכה דיגיטלית',
        examples: ['סיוע בפענוח חומרים מהטלפון של רועי מונדר'],
      },
    ],
  },
  {
    key: 'housing',
    title: 'סיוע כלכלי ומגורים',
    icon: 'home_work',
    colorKey: 'סיוע כלכלי ומגורים',
    items: [
      {
        label: 'סיוע כלכלי',
        examples: ['בירור עבור יתרות ומענקים', 'בקשה למענק שיקומי'],
      },
      {
        label: 'פתרונות דיור',
        examples: ['מציאת דירת ביניים לאחר שבוע במלון'],
      },
      {
        label: 'הובלת תכולה וחלוקת שי',
        examples: [],
      },
    ],
    secondaryTitle: 'פנאי ושונות',
    secondaryIcon: 'beach_access',
    secondaryColorKey: 'פנאי ושונות',
    secondaryItems: [
      {
        label: 'נופש ופנאי',
        examples: ['בקשה ליציאה לנופש'],
      },
      {
        label: 'שיבוץ לצה״ל / מילואים',
        examples: ['אור לוק — ליווי גיוס לצה״ל'],
      },
      {
        label: 'פגישות עם בכירים',
        examples: ['בקשה לפגישה עם ירון'],
      },
    ],
  },
];

const METRICS_ITEMS = [
  { term: 'משפחות', desc: 'מספר משפחות ייחודיות בטיפול בתקופה הנבחרת.' },
  { term: 'משימות', desc: 'מספר הפעולות / הפניות שנפתחו וטופלו במערכת.' },
  { term: 'SLA (ימי טיפול)', desc: 'משך זמן ממוצע לסגירת מעגל טיפול במענה.' },
  {
    term: 'יחס עצימות',
    desc: 'משימות ÷ משפחות. מעל 1.8 = מורכבות קיצונית; ~1.5 = עומס ממוצע; קרוב ל־1 = שירות חלק.',
  },
];

const BOARD_ITEMS = [
  { term: 'תפוצה לעומת עצימות', desc: 'מפת חום וניתוח יחס משימות/משפחות לפי חודש.' },
  { term: 'טבלת פיזור מורחבת', desc: 'השוואה חודשית מפורטת לכל תת־סיווג.' },
  { term: 'מטריצת החלטות', desc: 'תצוגה דו־ממדית או תלת־ממדית לזיהוי חריגים.' },
  { term: 'פילוח כללי', desc: 'סיכום עומסים לפי קטגוריות ראשיות ותתי־סיווג מובילים.' },
  { term: 'מתכללים', desc: 'פילוח עומסים, מפת חום ו־DNA עבודה לפי רכז/ת.' },
];

function TaxonomyCategoryBlock({
  title,
  icon,
  colorKey,
  items,
  secondaryTitle,
  secondaryIcon,
  secondaryColorKey,
  secondaryItems,
}) {
  const accent = COLORS[colorKey] || 'var(--color-primary)';
  const secAccent = secondaryColorKey ? COLORS[secondaryColorKey] : null;

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-none border border-outline-variant/20 bg-surface-container-low p-4 md:p-5"
        style={{ borderRightWidth: '4px', borderRightColor: accent }}
      >
        <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-on-surface">
          <SectionIcon name={icon} className="!h-9 !w-9" />
          {title}
        </h4>
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.label} className="text-sm text-on-surface">
              <span className="font-semibold text-primary">{row.label}</span>
              {row.examples?.length > 0 ? (
                <span className="mt-1 block text-xs italic leading-relaxed text-on-surface-variant">
                  {row.examples.map((ex) => `«${ex}»`).join(' · ')}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {secondaryTitle && secondaryItems ? (
        <div
          className="rounded-none border border-outline-variant/20 bg-surface-container-low p-4 md:p-5"
          style={{
            borderRightWidth: '4px',
            borderRightColor: secAccent || 'var(--color-primary)',
          }}
        >
          <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-on-surface">
            <SectionIcon name={secondaryIcon} className="!h-9 !w-9" />
            {secondaryTitle}
          </h4>
          <ul className="space-y-3">
            {secondaryItems.map((row) => (
              <li key={row.label} className="text-sm text-on-surface">
                <span className="font-semibold text-primary">{row.label}</span>
                {row.examples?.length > 0 ? (
                  <span className="mt-1 block text-xs italic leading-relaxed text-on-surface-variant">
                    {row.examples.map((ex) => `«${ex}»`).join(' · ')}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function MethodologyView() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="zen-card-elevated border border-outline-variant/15">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
          <SectionIcon name="menu_book" className="!h-12 !w-12 shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-on-surface md:text-2xl">
              מתודולוגיית הניתוח וניהול העומסים
            </h2>
            <p className="mt-2 max-w-prose border-b border-primary-container/40 pb-3 text-sm text-on-surface-variant">
              ממעקב פניות גולמי לתשתית ניהול מבוססת נתונים · ינואר – מאי 2026
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-outline-variant">
              Operational excellence 2026
            </p>
          </div>
        </div>
      </div>

      <section className="zen-card border border-outline-variant/15">
        <div className="mb-5 flex items-center gap-3">
          <SectionIcon name="fact_check" />
          <h3 className="text-lg font-semibold text-primary">יסודות המתודולוגיה</h3>
        </div>
        <ul className="space-y-5">
          {METHODOLOGY_PILLARS.map((row) => (
            <li key={row.title} className="flex gap-4">
              <SectionIcon name={row.icon} className="!h-10 !w-10 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-on-surface">{row.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{row.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="zen-card border border-outline-variant/15">
        <div className="mb-2 flex flex-col gap-2 border-b border-outline-variant/15 pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <SectionIcon name="category" />
            <div>
              <h3 className="text-lg font-semibold text-primary">Taxonomy: סיווג מענים ודוגמאות</h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                חלוקה לנושאים ותיאורי משימה מייצגים מתוך המערכת
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-outline-variant">
            Authentic data classification
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {TAXONOMY_BLOCKS.map((block) => (
            <TaxonomyCategoryBlock
              key={block.key}
              title={block.title}
              icon={block.icon}
              colorKey={block.colorKey}
              items={block.items}
              secondaryTitle={block.secondaryTitle}
              secondaryIcon={block.secondaryIcon}
              secondaryColorKey={block.secondaryColorKey}
              secondaryItems={block.secondaryItems}
            />
          ))}
        </div>
      </section>

      <section className="zen-card border border-outline-variant/15">
        <div className="mb-4 flex items-center gap-3">
          <SectionIcon name="calculate" />
          <h3 className="text-lg font-semibold text-primary">הגדרות מדדים</h3>
        </div>
        <ul className="space-y-3">
          {METRICS_ITEMS.map((item) => (
            <li
              key={item.term}
              className="border-r-2 border-primary-container bg-surface-container-low px-4 py-3"
            >
              <p className="text-sm font-semibold text-on-surface">{item.term}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="zen-card border border-outline-variant/15">
        <div className="mb-4 flex items-center gap-3">
          <SectionIcon name="grid_view" />
          <h3 className="text-lg font-semibold text-primary">מטריצת החלטות (2D / 3D)</h3>
        </div>
        <p className="text-sm leading-relaxed text-on-surface-variant max-w-prose">
          המטריצה ממקמת כל תת־מענה לפי תפוצה (ציר X), מאמץ תפעולי (ציר Y) ונפח משימות (ציר Z בתלת־ממד).
          רביע &quot;העברת שרביט&quot; מסמן תהליכים שדורשים מינוי רפרנט מקצועי.
        </p>
      </section>

      <section className="zen-card border border-outline-variant/15">
        <div className="mb-4 flex items-center gap-3">
          <SectionIcon name="route" />
          <h3 className="text-lg font-semibold text-primary">מבנה הלוח</h3>
        </div>
        <ul className="mt-2 space-y-3">
          {BOARD_ITEMS.map((item) => (
            <li
              key={item.term}
              className="border-r-2 border-primary-container bg-surface-container-low px-4 py-3"
            >
              <p className="text-sm font-semibold text-on-surface">{item.term}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="border border-outline-variant/20 bg-primary-container/30 px-5 py-4 text-sm text-on-primary-container">
        <span className="font-semibold text-primary">הערה: </span>
        {LABELS.decisionBody}
      </div>
    </div>
  );
}
