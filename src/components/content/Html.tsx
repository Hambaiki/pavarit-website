import { cn } from "@/lib/cn";

import { Typography } from "../ui";

interface HtmlProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

export default function Html({ html, className }: HtmlProps) {
  return (
    <Typography
      variant="div"
      className={cn(
        "max-w-none prose",

        // Headings
        "prose-headings:text-typography-medium prose-headings:mb-2",
        "prose-h1:text-typography-strong prose-h1:mb-3",
        "prose-h2:text-typography-strong prose-h2:mb-3",
        "prose-h3:text-typography-strong",
        "prose-h4:text-typography-strong",
        "prose-h5:text-typography-strong",
        "prose-h6:text-typography-strong",

        // Paragraphs
        "prose-p:text-typography-weak prose-p:my-2",

        // Strong / emphasis
        "prose-strong:text-typography-strong",
        "prose-em:text-typography-medium",

        // Links
        "prose-a:text-typography-brand-light prose-a:no-underline hover:prose-a:underline",

        // Lists
        "prose-ul:my-2 prose-ol:my-2",
        "prose-li:text-typography-weak",
        "prose-li:marker:text-typography-medium",

        // Blockquote
        "prose-blockquote:text-typography-medium prose-blockquote:border-l-typography-brand-light",

        // Code
        "prose-code:text-typography-strong prose-code:bg-black/30 prose-code:px-1 prose-code:rounded",
        "prose-pre:bg-black/50 prose-pre:text-typography-weak",

        // HR
        "prose-hr:my-4 prose-hr:border-decorative-white/30",

        // Tables
        "prose-table:text-typography-weak",
        "prose-thead:text-typography-strong",
        "prose-th:text-typography-strong",
        "prose-td:border-decorative-white/20",
        "prose-tr:border-decorative-white/20",

        // Images / media
        "prose-img:rounded-lg",
        "prose-figure:my-4",
        "prose-figcaption:text-typography-weak",

        // Misc
        "prose-kbd:text-typography-strong",

        className
      )}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
}
