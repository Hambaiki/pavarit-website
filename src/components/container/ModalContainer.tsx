import { AnimatePresence, motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { useClickOutside } from "@/hooks/useClickOutside";

interface ModalContainerProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
  loading?: boolean;
  onClickOutside?: () => void;
}

const ModalContainer = ({
  children,
  className = "",
  visible = true,
  loading = false,
  onClickOutside,
}: ModalContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClickOutside ?? (() => {}));

  const isBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // useEffect(() => {
  //   if (visible) {
  //     const scrollY = window.scrollY;
  //     const hasVerticalScroll =
  //       document.documentElement.scrollHeight >
  //       document.documentElement.clientHeight;
  //     document.documentElement.style.overflowY = hasVerticalScroll
  //       ? "scroll"
  //       : "hidden";
  //     document.documentElement.style.position = "fixed";
  //     document.documentElement.style.height = "100%";
  //     document.documentElement.style.width = "100%";
  //     document.documentElement.style.top = `-${scrollY}px`;
  //   }
  //   return () => {
  //     const scrollY = document.documentElement.style.top;
  //     document.documentElement.style.overflowY = "";
  //     document.documentElement.style.position = "";
  //     document.documentElement.style.height = "";
  //     document.documentElement.style.width = "";
  //     document.documentElement.style.top = "";
  //     window.scrollTo(0, parseInt(scrollY || "0") * -1);
  //   };
  // }, [visible]);

  if (!isBrowser) {
    return null;
  }

  if (visible && loading) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-overlay ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
        >
          {onClickOutside ? (
            <div ref={ref} className={`${className}`}>
              {children}
            </div>
          ) : (
            children
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ModalContainer;
