import Navbar from "@/components/dashboard/common/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100dvh)] w-full">
      {/* Sidebar */}
      <Navbar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col mt-28 md:mt-0 md:ml-72 overflow-x-auto">
        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
