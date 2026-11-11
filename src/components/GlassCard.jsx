import { motion } from "framer-motion";

const spring = {
  type: "spring",
  stiffness: 280,
  damping: 24,
};

export default function GlassCard({
  children,
  index = 0,
  className = "",
  onClick,
  asLink = false,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.07 }}
      whileHover={asLink ? { y: -2 } : undefined}
      whileTap={asLink ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`glass-card overflow-hidden ${className}`}
    >
      {children}
    </motion.article>
  );
}
