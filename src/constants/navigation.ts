import { FEATURED_TOOLS } from "@/features/tools/constants";

export const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    subItems: [],
  },
  {
    label: "About",
    href: "/about",
    subItems: [],
  },
  {
    label: "Blog",
    href: "/blog",
    subItems: [
      { label: "Posts", href: "/blog" },
      { label: "All Posts", href: "/blog/all" },
      { label: "Tags", href: "/blog/tag" },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    subItems: FEATURED_TOOLS,
  },
  {
    label: "Contact",
    href: "/contact",
    subItems: [],
  },
];

export const DASHBOARD_NAV_ITEMS = [
  { label: "Home", href: "/dashboard" },
  {
    label: "Posts",
    href: "/dashboard/posts",
    subItems: [
      { label: "All Posts", href: "/dashboard/posts" },
      { label: "Create Post", href: "/dashboard/posts/create" },
    ],
  },
  { label: "Inquiries", href: "/dashboard/inquiries" },
  { label: "Settings", href: "/dashboard/settings" },
  {
    label: "Other",
    href: "",
    subItems: [
      { label: "Back to Website", href: "/" },
      { label: "Logout", href: "/logout" },
    ],
  },
];
