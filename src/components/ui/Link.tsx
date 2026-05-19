import { ComponentProps, forwardRef } from "react";

import NextLink from "next/link";

import { ensureAbsoluteUrl } from "@/lib/string";

export interface LinkProps extends ComponentProps<typeof NextLink> {
  href: string;
  external?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, target, rel, external, ...props }, ref) => {
    const linkProps = external
      ? {
          href: ensureAbsoluteUrl(href),
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {
          href,
          target,
          rel,
        };

    return <NextLink ref={ref} {...linkProps} {...props} />;
  }
);

Link.displayName = "Link";

export default Link;
