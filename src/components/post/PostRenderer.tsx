interface PostRendererProps {
  contentHtml: string;
}

function PostRenderer({ contentHtml }: PostRendererProps) {
  return (
    <article
      className="prose"
      dangerouslySetInnerHTML={{ __html: contentHtml || "" }}
    />
  );
}

export default PostRenderer;
