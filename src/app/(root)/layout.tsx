"use client";

import Navbar from "@/components/navigation/Navbar";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div className="flex min-h-screen flex-col w-full">
        <Navbar />

        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Layout;
