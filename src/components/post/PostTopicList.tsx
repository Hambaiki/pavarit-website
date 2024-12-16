import Link from "next/link";

type PostTopicListProps = {
  htmlContent: string;
};

const PostTopicList = ({ htmlContent: contentHtml }: PostTopicListProps) => {
  const extractTopics = (
    htmlString: string
  ): { content: string; id: string; level: number; parentId?: string }[] => {
    const headingRegex =
      /<h([23])[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h[23]>/g;
    const headingData: {
      content: string;
      id: string;
      level: number;
      parentId?: string;
    }[] = [];
    let lastH2Id: string | undefined;
    let match;

    // Find all matches of <h2> and <h3> tags with id attributes
    while ((match = headingRegex.exec(htmlString)) !== null) {
      // Remove any HTML tags inside the content
      const cleanedContent = match[3].replace(/<[^>]*>/g, "").trim();
      const level = parseInt(match[1]);
      const id = match[2];

      if (level === 2) {
        lastH2Id = id;
        headingData.push({
          level,
          id,
          content: cleanedContent,
        });
      } else if (level === 3 && lastH2Id) {
        headingData.push({
          level,
          id,
          content: cleanedContent,
          parentId: lastH2Id,
        });
      }
    }

    return headingData;
  };

  const topics = extractTopics(contentHtml);

  const renderTopics = () => {
    return topics.map((topic, index) => {
      if (topic.level === 2) {
        const subTopics = topics.filter((t) => t.parentId === topic.id);
        return (
          <li key={index}>
            <Link href={`#${topic.id}`}>
              <h2>
                &#8226;
                <span className="ml-2 underline underline-offset-4 text-sm text-suzuha-teal-500">
                  {topic.content}
                </span>
              </h2>
            </Link>
            {subTopics.length > 0 && (
              <ul className="ml-6 mt-2 flex flex-col gap-2">
                {subTopics.map((subTopic, subIndex) => (
                  <li key={`${index}-${subIndex}`}>
                    <Link href={`#${subTopic.id}`}>
                      <h3>
                        &#8226;
                        <span className="ml-2 underline underline-offset-4 text-sm text-suzuha-teal-600">
                          {subTopic.content}
                        </span>
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      }
      return null;
    });
  };

  return (
    <div
      className={`${
        !(topics.length > 0) && "hidden"
      } rounded-xl p-4 bg-neutral-900`}
    >
      <p className="font-semibold mb-4">Topics</p>

      <ul className="flex flex-col gap-2">{renderTopics()}</ul>
    </div>
  );
};

export default PostTopicList;
