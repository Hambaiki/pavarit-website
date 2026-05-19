import { FaArrowLeft, FaCog, FaNewspaper } from "react-icons/fa";

import MainContainer from "@/components/dashboard/common/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import OptionMenuGrid, { OptionMenuItem } from "@/components/ui/OptionMenuGrid";

const breadcrumbs = [{ label: "Home", href: "/dashboard" }];

const menuItems: OptionMenuItem[] = [
  {
    title: "CMS Access",
    description: "Access the CMS to manage posts and categories.",
    action: "Start",
    href: "/dashboard/posts",
    icon: <FaNewspaper />,
  },
  {
    title: "Website Settings",
    description: "Manage website settings.",
    action: "View Settings",
    href: "/dashboard/settings",
    icon: <FaCog />,
  },
  {
    title: "Back to Website",
    description: "Go back to the main website.",
    action: "Go to Website",
    href: "/",
    icon: <FaArrowLeft />,
  },
];

export default function Dashboard() {
  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col mt-8 gap-4">
        <h2>Administrator Menu</h2>
        <OptionMenuGrid items={menuItems} />
      </div>
    </MainContainer>
  );
}
