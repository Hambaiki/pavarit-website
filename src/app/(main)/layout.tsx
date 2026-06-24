import Footer from "@/components/Footer";
import Navbar from "@/components/navigation/Navbar";
import BackToTop from "@/components/ui/BackToTop";

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-dvh w-full">
      <Navbar className="max-w-6xl mx-auto p-4 md:p-8" />

      <main className="flex-1">{children}</main>

      <Footer />

      <BackToTop />
    </div>
  );
}

export default Layout;
