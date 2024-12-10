export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  // { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  // { label: "Contact", href: "/contact" },
];

export const contactItems = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
  { label: "Github", href: process.env.NEXT_PUBLIC_GITHUB_URL },
  { label: "Email", href: `mailto:${process.env.NEXT_PUBLIC_EMAIL}` },
  // { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
  // { label: "Twitter", href: process.env.NEXT_PUBLIC_TWITTER_URL },
  // { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
];
