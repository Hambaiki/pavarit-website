import MainHeader from "@/components/common/MainHeader";
import MainContainer from "@/components/dashboard/common/MainContainer";
import OnlineInquiryEntries from "@/components/dashboard/online-inquiries/OnlineInquiryEntries";

export default function MaintenanceSettings() {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Online Inquiries", href: "/dashboard/online-inquiries" },
  ];

  return (
    <MainContainer>
      <MainHeader
        title="Online Inquiries"
        description="View all inquiries."
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-8">
        <OnlineInquiryEntries />
      </div>
    </MainContainer>
  );
}
