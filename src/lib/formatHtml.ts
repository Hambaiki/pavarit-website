const BLOCK_TAGS = new Set([
  "p",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "iframe",
]);

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
]);

function attrString(el: Element): string {
  const attrs = Array.from(el.attributes)
    .map((a) => (a.value ? `${a.name}="${a.value}"` : a.name))
    .join(" ");
  return attrs ? ` ${attrs}` : "";
}

function serializeInline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const attrs = attrString(el);

  if (VOID_TAGS.has(tag)) return `<${tag}${attrs}>`;

  const inner = Array.from(el.childNodes).map(serializeInline).join("");
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

function serializeNode(node: Node, depth: number): string {
  const pad = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? "";
    return text ? `${pad}${text}` : "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const attrs = attrString(el);

  if (VOID_TAGS.has(tag)) return `${pad}<${tag}${attrs}>`;

  // Preserve pre content verbatim
  if (tag === "pre") return `${pad}<${tag}${attrs}>${el.innerHTML}</${tag}>`;

  const isBlock = BLOCK_TAGS.has(tag);
  const hasBlockChild = Array.from(el.childNodes).some(
    (c) =>
      c.nodeType === Node.ELEMENT_NODE &&
      BLOCK_TAGS.has((c as Element).tagName.toLowerCase())
  );

  if (isBlock && hasBlockChild) {
    const inner = Array.from(el.childNodes)
      .map((c) => serializeNode(c, depth + 1))
      .filter(Boolean)
      .join("\n");
    return `${pad}<${tag}${attrs}>\n${inner}\n${pad}</${tag}>`;
  }

  const inline = Array.from(el.childNodes).map(serializeInline).join("");
  return isBlock
    ? `${pad}<${tag}${attrs}>${inline}</${tag}>`
    : serializeInline(el);
}

export function formatHtml(html: string): string {
  if (typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");

  return Array.from(doc.body.childNodes)
    .map((c) => serializeNode(c, 0))
    .filter(Boolean)
    .join("\n");
}
