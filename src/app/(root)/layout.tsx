import Navbar from "@/components/navigation/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <Navbar />

      {children}
    </div>
  );
};

export default Layout;
