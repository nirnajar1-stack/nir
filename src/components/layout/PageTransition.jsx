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
      x: 32,
      y: 10,
      scale: 0.96,
      rotateY: -6,
      filter: 'blur(14px)',
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55,
        ease: EASE_OUT,
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      x: -28,
      y: -6,
      scale: 0.97,
      rotateY: 4,
      filter: 'blur(10px)',
      transition: { duration: 0.34, ease: [0.4, 0, 0.2, 1] },
    },
  };
}

export const pageItemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
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
              className="page-transition-glow pointer-events-none absolute -top-4 right-0 h-24 w-48 bg-primary/10 blur-3xl"
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
