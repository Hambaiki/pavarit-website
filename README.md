# Pavarit Personal Website

The source for [www.pavarit.net](https://www.pavarit.net), built with Next.js,
React, and Tailwind CSS. Posts are written in Markdown and versioned with the
site source; no CMS, database, or environment-specific content service is
required.

## Getting Started

Requirements: Node.js 18 or later and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing Posts

1. Add a `.md` file under `content/posts/`.
2. Add images and other public files under `public/` and refer to them from
   Markdown with site-root paths such as `/images/posts/my-post/cover.jpg`.
3. Set the post metadata in YAML frontmatter. For example:

   ```yaml
   ---
   title: "A Post Title"
   slug: "a-post-title"
   description: "A short summary for listings and search engines."
   category: "Travel"
   tags:
     - travel
     - japan
   keywords:
     - Japan travel
   author: "Pavarit Wiriyakunakorn"
   createDate: "2026-10-08"
   modifiedDate: "2026-10-08"
   image: "/images/posts/a-post-title/cover.jpg"
   altText: "A description of the cover image"
   ---
   Write the post body in Markdown.
   ```

4. To include a post in the featured carousel, add `_featured` to its tags.
5. Commit the file and deploy the site to publish it.

The `slug` field determines the post URL (`/posts/<slug>`). Tag pages are
generated from the tags in the Markdown frontmatter.

## Styling and Colors

Use semantic Tailwind color utilities for UI colors instead of raw gray or
brand shades. Available roles include `bg-canvas`, `bg-surface`,
`bg-surface-raised`, `text-content`, `text-content-secondary`,
`text-content-muted`, `border-border`, and `text-accent`.

The semantic values are defined in `src/app/globals.css` in the `:root` block
and mapped to Tailwind utilities in `@theme inline`. Update those variables to
change the site theme consistently. Brand palettes remain available there for
specific brand graphics and accents.

## Validation and Deployment

```bash
npm run lint
npm run format
npm run format:check
npm run build
```

Deploy the Next.js application to Vercel or another compatible host.
