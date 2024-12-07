import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import Icons from "@constants/icons";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);

      // Automatically remove the toast after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-4 left-4 space-y-2 z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <button
              className={`flex flex-row items-center space-x-4 p-4 rounded-xl shadow-xl bg-white font-bold
                transition-transform transform ${
                  toast.type === "success"
                    ? "border border-green text-green"
                    : toast.type === "error"
                    ? "border border-red text-red"
                    : "border border-blue_primary text-blue_primary"
                }`}
              onClick={() => removeToast(toast.id)}
            >
              {toast.type === "success" && (
                <Image
                  src={Icons.CompleteClipboard}
                  alt="success"
                  width={48}
                  height={48}
                />
              )}

              {toast.type === "error" && (
                <Image
                  src={Icons.OTPError}
                  alt="error"
                  width={48}
                  height={48}
                />
              )}
              <span>{toast.message}</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { addToast, ToastContainer };
};
