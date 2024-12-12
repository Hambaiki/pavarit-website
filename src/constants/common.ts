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
      { label: "About", href: "/about" },
      { label: "Gaming", href: "/about/gaming" },
      { label: "Hobbies", href: "/about/hobbies" },
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

export const contactItems = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
  { label: "Github", href: process.env.NEXT_PUBLIC_GITHUB_URL },
  { label: "Email", href: `mailto:${process.env.NEXT_PUBLIC_EMAIL}` },
  // { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  // { label: "Twitter", href: process.env.NEXT_PUBLIC_TWITTER_URL },
  // { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
];
