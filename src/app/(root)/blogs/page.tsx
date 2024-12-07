import Breadcrumbs from "@/components/navigation/Breadcrumbs";

function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
  ];

  return (
    <main className="max-w-4xl mx-auto space-y-8 p-8">
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Blogs</h1>
          <p className="text-neutral-300">
            Here are some of my blogs. I write about my experiences and thoughts
            about technology, life, and other things.
          </p>
        </div>
      </header>

      <div className="flex flex-col space-y-4">
        {mockBlogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col space-y-2 p-4 bg-neutral-900 rounded-xl"
          >
            <h2 className="text-2xl font-semibold">{blog.title}</h2>
            <p className="text-neutral-300">{blog.subtitle}</p>

            <ul className="flex flex-row flex-wrap space-x-2">
              {blog.tags.map((tag) => (
                <li
                  key={tag.id}
                  className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                >
                  {tag.label}
                </li>
              ))}
            </ul>

            {/* <div className="p-4 bg-neutral-800 rounded-xl">
              <p className="text-neutral-300">{blog.content}</p>
            </div> */}
          </div>
        ))}
      </div>
    </main>
  );
}

const mockBlogs = [
  {
    id: 1,
    title: "Blog 1",
    subtitle: "Subtitle 1",
    tags: [
      { label: "tag1", description: "Description 1", id: 1 },
      { label: "tag2", description: "Description 2", id: 2 },
      { label: "tag3", description: "Description 3", id: 3 },
    ],
    content: "Content 1",
  },
  {
    id: 2,
    title: "Blog 2",
    subtitle: "Subtitle 2",
    tags: [
      { label: "tag1", description: "Description 1", id: 1 },
      { label: "tag2", description: "Description 2", id: 2 },
      { label: "tag3", description: "Description 3", id: 3 },
    ],
    content: "Content 2",
  },
  {
    id: 3,
    title: "Blog 3",
    subtitle: "Subtitle 3",
    tags: [
      { label: "tag1", description: "Description 1", id: 1 },
      { label: "tag2", description: "Description 2", id: 2 },
      { label: "tag3", description: "Description 3", id: 3 },
    ],
    content: "Content 3",
  },
];

export default page;
