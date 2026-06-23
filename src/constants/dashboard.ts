import { FaArrowLeft, FaCog, FaNewspaper } from "react-icons/fa";

import { OptionMenuItem } from "@/components/ui/OptionMenuGrid";

export const menuItems: OptionMenuItem[] = [
  {
    title: "CMS Access",
    description: "Access the CMS to manage posts and categories.",
    action: "Start",
    href: "/dashboard/posts",
    icon: FaNewspaper,
  },
  {
    title: "Website Settings",
    description: "Manage website settings.",
    action: "View Settings",
    href: "/dashboard/settings",
    icon: FaCog,
  },
  {
    title: "Back to Website",
    description: "Go back to the main website.",
    action: "Go to Website",
    href: "/",
    icon: FaArrowLeft,
  },
];
