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
      { label: "Experience", href: "/about#experience" },
      { label: "Education", href: "/about#education" },
      // { label: "Projects", href: "/about/projects" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    subItems: [],
  },
  {
    label: "Posts",
    href: "/posts",
    subItems: [
      { label: "Posts", href: "/posts" },
      { label: "All Posts", href: "/posts/all" },
      { label: "Tags", href: "/posts/tag" },
    ],
  },
];
