import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CollapsibleContainerProps {
  collapsed: boolean;
  startCollapsed?: boolean;
  direction?: "vertical" | "horizontal";
  className?: string;
  children: ReactNode;
}

const CollapsibleContainer = ({
  collapsed,
  startCollapsed = false,
  direction = "vertical",
  className,
  children,
  ...props
}: CollapsibleContainerProps) => {
  const isVertical = direction === "vertical";

  return (
    <AnimatePresence initial={startCollapsed}>
      {!collapsed && (
        <motion.div
          initial={{
            [isVertical ? "height" : "width"]: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
          animate={{
            [isVertical ? "height" : "width"]: "auto",
            opacity: 1,
            pointerEvents: "auto",
          }}
          exit={{
            [isVertical ? "height" : "width"]: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden", willChange: "auto" }} // Prevents phantom space (┛◉Д◉)┛彡┻━┻
          {...props}
          className={`${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollapsibleContainer;
