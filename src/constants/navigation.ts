export const navItems = [
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
    label: "Contact",
    href: "/contact",
    subItems: [],
  },
];

export const dashboardNavItems = [
  { label: "Home", href: "/dashboard" },
  {
    label: "Posts",
    href: "/dashboard/posts",
    subItems: [
      { label: "All Posts", href: "/dashboard/posts" },
      { label: "Create Post", href: "/dashboard/posts/create" },
    ],
  },
  { label: "Online Inquiries", href: "/dashboard/online-inquiries" },
  { label: "Settings", href: "/dashboard/settings" },
  {
    label: "Other",
    href: "",
    subItems: [
      { label: "Back to Website", href: "/" },
      { label: "Logout", href: "/api/auth/logout" },
    ],
  },
];
