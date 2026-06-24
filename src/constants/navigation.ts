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
    label: "Tools",
    href: "/tools",
    subItems: [
      {
        label: "Image Compressor & Converter",
        href: "/tools/image-compressor-and-converter",
      },
      { label: "HTML Editor", href: "/tools/html-editor" },
      { label: "Scratchpad", href: "/tools/scratchpad" },
      { label: "Markdown Converter", href: "/tools/markdown" },
      { label: "Case Converter", href: "/tools/case-converter" },
      { label: "Slug Generator", href: "/tools/slug-generator" },
      { label: "UUID Generator", href: "/tools/uuid-generator" },
      { label: "Code Highlighter", href: "/tools/code-highlighter" },
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
