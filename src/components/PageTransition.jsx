import { motion } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94];

export default function PageTransition({ children }) {
  return (
    <motion.main
      className="page-transition"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.38, ease }}
    >
      {children}
    </motion.main>
  );
}
