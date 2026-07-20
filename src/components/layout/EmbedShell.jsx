import { motion } from 'framer-motion';
import PageTransition, { pageItemVariants } from './PageTransition.jsx';

export default function EmbedShell({ pageKey, children }) {
  return (
    <motion.div className="embed-shell min-h-screen bg-background text-on-background font-body" dir="rtl">
      <main id="main-content" className="embed-shell__main">
        <PageTransition pageKey={pageKey}>
          <motion.div variants={pageItemVariants} className="embed-shell__content">
            {children}
          </motion.div>
        </PageTransition>
      </main>
    </motion.div>
  );
}
