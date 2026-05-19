import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1];

function getVariants(reduceMotion) {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    };
  }
  return {
    initial: {
      opacity: 0,
      y: 48,
      scale: 0.985,
      filter: 'blur(8px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.52,
        ease: EASE_OUT,
        staggerChildren: 0.055,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      y: -36,
      scale: 0.99,
      filter: 'blur(6px)',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };
}

export const pageItemVariants = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT },
  },
};

/** @param {{ pageKey: string; children: import('react').ReactNode; className?: string }} props */
export default function PageTransition({ pageKey, children, className = '' }) {
  const reduceMotion = useReducedMotion();
  const variants = getVariants(reduceMotion);

  return (
    <div className="page-transition-root relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pageKey}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={className}
        >
          {!reduceMotion && (
            <motion.div
              className="page-transition-glow pointer-events-none absolute -bottom-2 right-1/2 h-20 w-64 -translate-x-1/2 bg-primary/10 blur-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              aria-hidden
            />
          )}
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
