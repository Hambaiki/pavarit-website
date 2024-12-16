interface PostRendererProps {
  contentHtml: string;
}

function PostRenderer({ contentHtml }: PostRendererProps) {
  return (
    <article
      className="
        prose
        max-w-none
        prose-div:w-full
        prose-strong:text-white
        prose-h1:text-white prose-h1:font-bold prose-h1:text-4xl prose-h1:mb-4
        prose-h2:text-white prose-h2:font-bold prose-h2:text-3xl prose-h2:mb-4
        prose-h3:text-white prose-h3:font-bold prose-h3:text-2xl prose-h3:mb-4
        prose-h4:text-white prose-h4:font-bold prose-h4:text-xl prose-h4:mb-4
        prose-h5:text-white prose-h5:font-bold prose-h5:text-lg prose-h5:mb-4
        prose-h6:text-white prose-h6:font-bold prose-h6:text-base prose-h6:mb-4
        prose-p:text-white prose-p:mb-4
        prose-ul:list-disc prose-ul:ml-4 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:ml-4 prose-ol:mb-4
        prose-li:mb-2 prose-li:text-white prose-li:font-normal
        prose-blockquote:text-white prose-blockquote:font-normal prose-blockquote:mb-4
        prose-code:text-white prose-code:font-mono prose-code:bg-neutral-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:mb-2
        prose-pre:bg-neutral-900 prose-pre:p-4 prose-pre:rounded-md prose-pre:mb-4
        prose-table:text-white prose-table:bg-neutral-900 prose-table:mb-4
        prose-thead:bg-neutral-800 prose-thead:text-white prose-thead:font-bold
        prose-tbody:bg-neutral-900 prose-tbody:text-white prose-tbody:font-normal
        prose-tr:border-b prose-tr:border-neutral-800
        prose-th:text-white prose-th:font-bold prose-th:p-2 prose-th:text-left
        prose-td:text-white prose-td:p-2 prose-td:text-left
        prose-img:rounded-xl prose-img:mb-4 prose-img:w-full prose-img:max-w-lg prose-img:h-auto prose-img:mx-auto
        prose-a:underline prose-a:text-suzuha-teal-500 prose-a:decoration-suzuha-teal-500 prose-a:underline-offset-4 prose-a:decoration-2 prose-a:transition-all prose-a:duration-300 prose-a:ease-in-out prose-a:hover:text-suzuha-teal-600"
      dangerouslySetInnerHTML={{ __html: contentHtml || "" }}
    />
  );
}

export default PostRenderer;
