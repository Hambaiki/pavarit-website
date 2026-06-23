import Navbar from "@/components/dashboard/common/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100dvh)] w-full">
      {/* Sidebar */}
      <Navbar className="p-4 md:fixed md:top-0 md:left-0 w-full md:w-60 md:h-full md:bg-white/50 md:border-r md:border-gray-200" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-60 overflow-x-auto">
        {/* Page content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
