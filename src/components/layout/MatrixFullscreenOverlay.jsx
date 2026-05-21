import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import SectionIcon from '../ui/SectionIcon.jsx';

/** @param {{ open: boolean; onClose: () => void; matrixMode: '2d' | '3d'; children: import('react').ReactNode }} props */
export default function MatrixFullscreenOverlay({ open, onClose, matrixMode, children }) {
  useEffect(() => {
    if (!open) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-inverse-surface text-on-primary"
      style={{ height: '100dvh', width: '100vw' }}
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="מטריצת החלטות במסך מלא"
    >
      <header className="shrink-0 border-b border-outline-variant/30 px-4 py-4 md:px-8 md:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SectionIcon name="psychology" className="!h-12 !w-12" />
            <div>
              <h2 className="text-xl font-black text-on-primary md:text-2xl">
                מטריצת החלטות אסטרטגית — מסך מלא
              </h2>
              <p className="text-sm text-outline-variant">
                {matrixMode === '3d' ? 'תצוגה תלת־ממדית' : 'תצוגה דו־ממדית'} · איפיון וסיווג משימות תחת מטה בקרה ארצי
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 self-end bg-red-600 px-5 py-3 text-xs font-extrabold text-on-primary shadow-lg transition-colors hover:bg-red-700"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            סגור מסך מלא
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 w-full overflow-hidden bg-inverse-surface">
        {children}
      </div>
    </div>,
    document.body,
  );
}
