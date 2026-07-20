import { motion } from 'framer-motion';
import { AVSHA_PRESENTATION } from '../data/avshaPresentationData.js';

const deckVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const slideVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

function BackgroundLayer({ slide, index }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(202,138,4,0.2),transparent_34%),linear-gradient(135deg,rgba(47,52,46,0.96),rgba(79,94,127,0.88)_54%,rgba(47,52,46,0.94))]" />
      <div className="absolute -left-16 top-8 h-52 w-52 rounded-full border border-white/10" />
      <div className="absolute bottom-8 right-10 h-24 w-72 border-t border-white/15" />
      <div className="absolute inset-y-0 left-0 w-[42%] bg-white/[0.06]" />
      <div className="absolute left-8 top-8 text-xs font-semibold tracking-[0.3em] text-white/45">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}

function SlideFrame({ slide, index, children, tone = 'dark' }) {
  const isDark = tone === 'dark';

  return (
    <motion.article
      variants={slideVariants}
      className={`relative aspect-video overflow-hidden rounded-[2rem] border ${
        isDark
          ? 'border-white/10 bg-on-background text-white'
          : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface'
      }`}
    >
      {isDark && <BackgroundLayer slide={slide} index={index} />}
      <div className="relative z-10 flex h-full flex-col p-10 md:p-12">
        <div className="mb-6 flex items-center justify-between gap-6 text-xs font-semibold tracking-[0.18em]">
          <span className={isDark ? 'text-tertiary-fixed' : 'text-primary'}>{slide.eyebrow}</span>
          <span className={isDark ? 'text-white/45' : 'text-outline'}>{AVSHA_PRESENTATION.lastUpdated}</span>
        </div>
        {children}
      </div>
    </motion.article>
  );
}

function MetricStrip({ metrics, muted = false }) {
  if (!metrics?.length) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((metric) => (
        <div
          key={`${metric.value}-${metric.label}`}
          className={`rounded-2xl border p-4 ${
            muted ? 'border-outline-variant/30 bg-surface-container-low' : 'border-white/10 bg-white/[0.08]'
          }`}
        >
          <div className={`text-3xl font-black ${muted ? 'text-primary' : 'text-tertiary-fixed'}`}>{metric.value}</div>
          <div className={`mt-1 text-xs font-medium ${muted ? 'text-on-surface-variant' : 'text-white/65'}`}>
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function PointList({ points, dark = false }) {
  if (!points?.length) return null;

  return (
    <div className="space-y-3">
      {points.map((point) => (
        <div
          key={point.kicker}
          className={`rounded-2xl border p-4 ${
            dark ? 'border-white/10 bg-white/[0.08]' : 'border-outline-variant/30 bg-surface-container-lowest'
          }`}
        >
          <div className={`text-sm font-extrabold ${dark ? 'text-tertiary-fixed' : 'text-primary'}`}>
            {point.kicker}
          </div>
          <p className={`mt-1 text-sm leading-relaxed ${dark ? 'text-white/72' : 'text-on-surface-variant'}`}>
            {point.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function HeroSlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index}>
      <div className="grid flex-1 grid-cols-[1.2fr_0.8fr] items-end gap-10">
        <div>
          <h2 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-tight">{slide.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/76">{slide.subtitle}</p>
        </div>
        <MetricStrip metrics={slide.metrics} />
      </div>
    </SlideFrame>
  );
}

function SplitSlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index} tone="light">
      <div className="grid flex-1 grid-cols-[0.92fr_1.08fr] gap-8">
        <div className="flex flex-col justify-between rounded-[1.75rem] bg-on-background p-8 text-white">
          <div>
            <div className="mb-8 h-16 w-16 rounded-2xl bg-tertiary-fixed/90" />
            <h2 className="text-3xl font-black leading-tight">{slide.title}</h2>
          </div>
          <p className="text-base leading-relaxed text-white/68">{slide.subtitle}</p>
        </div>
        <div className="flex flex-col justify-center">
          <PointList points={slide.points} />
        </div>
      </div>
    </SlideFrame>
  );
}

function FamilySlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index}>
      <div className="grid flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-10">
        <div>
          <h2 className="text-4xl font-black leading-tight">{slide.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-white/72">{slide.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {slide.family.map((member) => (
            <div key={member.name} className="min-h-36 rounded-3xl border border-white/10 bg-white/[0.08] p-5">
              <div className="text-2xl font-black text-tertiary-fixed">{member.name}</div>
              <div className="mt-3 text-sm leading-relaxed text-white/72">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function ImpactSlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index}>
      <div className="grid flex-1 grid-cols-[1fr_0.9fr] gap-10">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-black leading-tight">{slide.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/72">{slide.subtitle}</p>
          </div>
          <MetricStrip metrics={slide.metrics} />
        </div>
        <div className="flex items-center">
          <PointList points={slide.points} dark />
        </div>
      </div>
    </SlideFrame>
  );
}

function RiskSlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index} tone="light">
      <div className="flex flex-1 flex-col">
        <div className="max-w-4xl">
          <h2 className="text-4xl font-black leading-tight">{slide.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-on-surface-variant">{slide.subtitle}</p>
        </div>
        <div className="mt-auto grid grid-cols-3 gap-4">
          {slide.points.map((point) => (
            <div key={point.kicker} className="rounded-3xl bg-surface-container p-6">
              <div className="mb-8 h-1.5 w-16 bg-primary" />
              <div className="text-lg font-black text-on-surface">{point.kicker}</div>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function RoadmapSlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index}>
      <div className="grid flex-1 grid-cols-[0.78fr_1.22fr] gap-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-black leading-tight">{slide.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-white/72">{slide.subtitle}</p>
        </div>
        <div className="flex flex-col justify-center gap-4">
          {slide.roadmap.map((item) => (
            <div key={item.step} className="grid grid-cols-[4rem_1fr] gap-4 rounded-3xl border border-white/10 bg-white/[0.08] p-5">
              <div className="text-3xl font-black text-tertiary-fixed">{item.step}</div>
              <div>
                <div className="text-lg font-black">{item.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function ClosingSlide({ slide, index }) {
  return (
    <SlideFrame slide={slide} index={index}>
      <div className="flex flex-1 flex-col justify-between">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-black leading-[1.06]">{slide.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/74">{slide.subtitle}</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {slide.callouts.map((callout) => (
            <div key={callout} className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 text-sm font-bold text-white/82">
              {callout}
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function renderSlide(slide, index) {
  if (slide.layout === 'hero') return <HeroSlide key={slide.id} slide={slide} index={index} />;
  if (slide.layout === 'split') return <SplitSlide key={slide.id} slide={slide} index={index} />;
  if (slide.layout === 'family') return <FamilySlide key={slide.id} slide={slide} index={index} />;
  if (slide.layout === 'impact') return <ImpactSlide key={slide.id} slide={slide} index={index} />;
  if (slide.layout === 'risk') return <RiskSlide key={slide.id} slide={slide} index={index} />;
  if (slide.layout === 'roadmap') return <RoadmapSlide key={slide.id} slide={slide} index={index} />;
  return <ClosingSlide key={slide.id} slide={slide} index={index} />;
}

export default function AvshaPresentationView({ embed = false }) {
  return (
    <section className={`presentation-deck ${embed ? 'presentation-deck--embed' : ''}`}>
      {!embed && (
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-primary">טיוטת מצגת למשרד הכלכלה</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-on-surface">{AVSHA_PRESENTATION.businessName}</h2>
          </div>
          <div className="rounded-full border border-outline-variant/40 px-4 py-2 text-sm text-on-surface-variant">
            איש קשר: {AVSHA_PRESENTATION.contactName}
          </div>
        </div>
      )}

      <motion.div
        variants={deckVariants}
        initial="hidden"
        animate="show"
        className={`mx-auto space-y-8 ${embed ? 'max-w-none' : 'max-w-7xl'}`}
      >
        {AVSHA_PRESENTATION.slides.map((slide, index) => renderSlide(slide, index))}
      </motion.div>
    </section>
  );
}
