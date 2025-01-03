import MainContainer from "@/components/dashboard/common/MainContainer";
import OnlineInquiryEntries from "@/components/dashboard/online-inquiries/OnlineInquiryEntries";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export default function MaintenanceSettings() {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Online Inquiries", href: "/dashboard/online-inquiries" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>Online Inquiries</h1>
          <p>View all inquiries.</p>
        </div>
      </header>

      <div className="mt-8">
        <OnlineInquiryEntries />
      </div>
    </MainContainer>
  );
}
