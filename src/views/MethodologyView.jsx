import SectionIcon from '../components/ui/SectionIcon.jsx';
import { COLORS, LABELS } from '../data.js';

const DATA_COVERAGE_ASSUMPTION = {
  icon: 'info',
  title: 'הנחת עבודה — כיסוי נתונים',
  body:
    'מוערך שכ־20% מהעבודה שבוצעה לא תועדה ולא נוהלה במערכת, ולכן לא נכללה בניתוח. המספרים משקפים את מה שנרשם בפועל — לא את כלל הפעילות בשטח.',
};

const METHODOLOGY_PILLARS = [
  {
    icon: 'database',
    title: 'מקור הנתונים וגבולות הגזרה',
    body:
      'משימות שנפתחו בסיילפורס מינואר 2026 עד תחילת מאי 2026, כולל משפחות משרד הביטחון. הניתוח מבוסס על רישום מערכתי בלבד.',
  },
  {
    icon: 'assignment_ind',
    title: 'שיוך ואחריות מקצועית',
    body:
      'משימות נספרות לפי תקופת בעלות המשפחה — נפתחו בטווח הבעלות על המשפחה. במידה ונעשתה העברת אחריות וניהול למתכלל/ת אחר/ת, משימות שלא נסגרו שויכו למתכלל/ת הנכנס/ה.',
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
  { term: LABELS.families, desc: 'מספר משפחות ייחודיות בטיפול בתקופה הנבחרת.' },
  { term: LABELS.tasks, desc: 'מספר הפעולות / הפניות שנפתחו וטופלו במערכת — פריסת העומס.' },
  { term: 'SLA (ימי טיפול)', desc: 'משך זמן ממוצע לסגירת מעגל טיפול במענה.' },
  {
    term: LABELS.intensityCol,
    desc: 'משימות ÷ משפחות בטיפול. מעל 1.8 = מורכבות קיצונית; ~1.5 = עומס ממוצע; קרוב ל־1 = שירות חלק.',
  },
];

const BOARD_ITEMS = [
  { term: 'פריסה, תפוצה ופילוח', desc: 'מבט על קטגוריות, מפת חום, מגמה חודשית וניתוח יחס משימות/משפחות ייחודיות.' },
  { term: LABELS.spreadTitle, desc: 'השוואה חודשית מפורטת לכל תת־סיווג.' },
  { term: 'מטריצת החלטות', desc: 'תצוגה דו־ממדית או תלת־ממדית לפי תפוצה, מאמץ ונפח משימות.' },
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
        className="methodology-taxonomy-card surface-interactive"
        style={{ borderRightColor: accent }}
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-on-surface">
          <SectionIcon name={icon} className="!h-9 !w-9" />
          {title}
        </h4>
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.label} className="methodology-taxonomy-row text-sm text-on-surface">
              <span className="methodology-taxonomy-row__label font-semibold text-primary transition-colors">
                {row.label}
              </span>
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
          className="methodology-taxonomy-card surface-interactive"
          style={{ borderRightColor: secAccent || 'var(--color-primary)' }}
          tabIndex={0}
          role="region"
          aria-label={secondaryTitle}
        >
          <h4 className="mb-3 flex items-center gap-2 text-base font-bold text-on-surface">
            <SectionIcon name={secondaryIcon} className="!h-9 !w-9" />
            {secondaryTitle}
          </h4>
          <ul className="space-y-3">
            {secondaryItems.map((row) => (
              <li key={row.label} className="methodology-taxonomy-row text-sm text-on-surface">
                <span className="methodology-taxonomy-row__label font-semibold text-primary transition-colors">
                  {row.label}
                </span>
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

function MethodologyPillarCard({ icon, title, body, variant = 'default' }) {
  const isHighlight = variant === 'highlight';
  return (
    <li
      className={
        isHighlight
          ? 'methodology-pillar methodology-pillar--highlight surface-interactive'
          : 'methodology-pillar surface-interactive'
      }
      tabIndex={0}
      role="article"
      aria-label={title}
    >
      <SectionIcon name={icon} className="methodology-pillar__icon !h-11 !w-11 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="methodology-pillar__title text-sm font-semibold text-on-surface transition-colors">
          {title}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{body}</p>
      </div>
    </li>
  );
}

function MethodologyListItem({ term, desc }) {
  return (
    <li className="methodology-list-item surface-interactive" tabIndex={0} role="article" aria-label={term}>
      <p className="methodology-list-item__term text-sm font-semibold text-on-surface transition-colors">
        {term}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{desc}</p>
    </li>
  );
}

export default function MethodologyView() {
  return (
    <div className="methodology-page max-w-5xl space-y-6">
      <div className="methodology-hero surface-interactive" tabIndex={0} role="region" aria-label="מתודולוגיית הניתוח">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
          <SectionIcon name="menu_book" className="methodology-hero__icon !h-14 !w-14 shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-on-surface md:text-2xl">
              מתודולוגיית הניתוח וניהול העומסים
            </h2>
            <p className="mt-2 max-w-prose border-b border-primary-container/40 pb-3 text-sm text-on-surface-variant">
              {LABELS.analysisGoal}
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              ממעקב פניות גולמי לתשתית ניהול מבוססת נתונים · ינואר – מאי 2026
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-outline-variant">
              Operational excellence 2026
            </p>
          </div>
        </div>
      </div>

      <section className="methodology-section surface-interactive" tabIndex={0} role="region" aria-label="יסודות המתודולוגיה">
        <div className="methodology-section__head">
          <SectionIcon name="fact_check" className="!rounded-2xl" />
          <h3 className="text-lg font-semibold text-primary">יסודות המתודולוגיה</h3>
        </div>
        <ul className="grid gap-4 sm:grid-cols-1">
          <MethodologyPillarCard
            icon={DATA_COVERAGE_ASSUMPTION.icon}
            title={DATA_COVERAGE_ASSUMPTION.title}
            body={DATA_COVERAGE_ASSUMPTION.body}
            variant="highlight"
          />
          {METHODOLOGY_PILLARS.map((row) => (
            <MethodologyPillarCard
              key={row.title}
              icon={row.icon}
              title={row.title}
              body={row.body}
            />
          ))}
        </ul>
      </section>

      <section className="methodology-section surface-interactive" tabIndex={0} role="region" aria-label="סיווג מענים">
        <div className="methodology-section__head methodology-section__head--split">
          <div className="flex items-center gap-3">
            <SectionIcon name="category" className="!rounded-2xl" />
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

      <section className="methodology-section surface-interactive" tabIndex={0} role="region" aria-label="הגדרות מדדים">
        <div className="methodology-section__head">
          <SectionIcon name="calculate" className="!rounded-2xl" />
          <h3 className="text-lg font-semibold text-primary">הגדרות מדדים</h3>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {METRICS_ITEMS.map((item) => (
            <MethodologyListItem key={item.term} term={item.term} desc={item.desc} />
          ))}
        </ul>
      </section>

      <section className="methodology-section surface-interactive" tabIndex={0} role="region" aria-label="מטריצת החלטות">
        <div className="methodology-section__head">
          <SectionIcon name="grid_view" className="!rounded-2xl" />
          <h3 className="text-lg font-semibold text-primary">מטריצת החלטות (2D / 3D)</h3>
        </div>
        <p className="methodology-prose text-sm leading-relaxed text-on-surface-variant">
          המטריצה ממקמת כל תת־מענה לפי תפוצה על משפחות בטיפול (ציר X), מאמץ תפעולי (ציר Y) ונפח משימות (ציר Z בתלת־ממד).
          רביע &quot;העברת שרביט&quot; מסייע לזהות היכן נדרש דיוק מענה והפניה לרפרנט מקצועי.
        </p>
      </section>

      <section className="methodology-section surface-interactive" tabIndex={0} role="region" aria-label="מבנה הלוח">
        <div className="methodology-section__head">
          <SectionIcon name="route" className="!rounded-2xl" />
          <h3 className="text-lg font-semibold text-primary">מבנה הלוח</h3>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {BOARD_ITEMS.map((item) => (
            <MethodologyListItem key={item.term} term={item.term} desc={item.desc} />
          ))}
        </ul>
      </section>

      <div className="methodology-footnote surface-interactive" tabIndex={0} role="note">
        <span className="font-semibold text-primary">הערה: </span>
        {LABELS.decisionBody}
      </div>
    </div>
  );
}
