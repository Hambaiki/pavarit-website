import Footer from "@/components/Footer";
import Navbar from "@/components/navigation/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-[calc(100lvh)] w-full">
      <Navbar className="fixed top-0 bg-primary-gray-background/80 backdrop-blur border-b border-primary-gray-border z-10" />

      <div className="flex-1 flex flex-col mt-20 md:mt-28">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;
