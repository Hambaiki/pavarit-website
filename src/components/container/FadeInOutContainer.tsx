import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface FadeInOutContainerProps {
  visible: boolean;
  className?: string;
  children: React.ReactNode;
}

const FadeInOutContainer = ({
  children,
  visible,
  className,
}: FadeInOutContainerProps) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeInOutContainer;
