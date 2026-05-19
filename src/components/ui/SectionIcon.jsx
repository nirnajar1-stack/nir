export default function SectionIcon({ name, className = '' }) {
  return (
    <span
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center bg-primary-container text-primary ${className}`}
      aria-hidden
    >
      <span className="material-symbols-outlined text-[1.35rem]">{name}</span>
    </span>
  );
}
