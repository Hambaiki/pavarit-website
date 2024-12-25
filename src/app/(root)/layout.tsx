import Footer from "@/components/Footer";
import Navbar from "@/components/navigation/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-[calc(100lvh)] w-full">
      <Navbar />

      <div className="flex-1 flex flex-col mt-20 md:mt-24">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;
