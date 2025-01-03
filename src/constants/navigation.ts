export const navItems = [
  {
    label: "Home",
    href: "/",
    subItems: [],
  },
  {
    label: "About",
    href: "/about",
    subItems: [
      { label: "About Me", href: "/about" },
      { label: "Projects", href: "/about/projects" },
    ],
  },
  // { label: "Projects", href: "/projects" },
  {
    label: "Contact",
    href: "/contact",
    subItems: [],
  },
  {
    label: "Blog",
    href: "/blog",
    subItems: [
      { label: "Posts", href: "/blog" },
      { label: "Tags", href: "/blog/tag" },
    ],
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
      // { label: "Post Settings", href: "/dashboard/posts/settings" },
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
