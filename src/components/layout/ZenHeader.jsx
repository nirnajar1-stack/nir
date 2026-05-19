export default function ZenHeader() {
  return (
    <header className="fixed left-0 right-64 top-0 z-40 flex h-20 items-center justify-start bg-background/80 px-12 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors duration-300 hover:text-primary"
          aria-label="התראות"
        >
          notifications
        </button>
        <button
          type="button"
          className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors duration-300 hover:text-primary"
          aria-label="הגדרות"
        >
          settings
        </button>
      </div>
    </header>
  );
}
