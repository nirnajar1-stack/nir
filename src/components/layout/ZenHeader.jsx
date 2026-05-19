export default function ZenHeader({ onMenuOpen }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-background/90 px-4 backdrop-blur-md md:h-20 md:px-8 lg:right-72 lg:px-12">
      <button
        type="button"
        onClick={onMenuOpen}
        className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary lg:hidden focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="פתח תפריט ניווט"
      >
        <span className="material-symbols-outlined">menu</span>
        <span className="text-sm font-medium">תפריט</span>
      </button>

      <div className="hidden flex-1 lg:block" aria-hidden />

      <div className="flex items-center gap-4 md:gap-6">
        <span className="hidden text-xs text-on-surface-variant md:inline">מערכת ניתוח מענים</span>
      </div>
    </header>
  );
}
