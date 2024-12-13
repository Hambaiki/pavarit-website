import Link from "next/link";
import Image from "next/image";
import { FaCalendar, FaUser } from "react-icons/fa6";
import { format } from "date-fns";

import { getPosts } from "@/lib/posts";

import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const tag = (await params).tag;
  const { posts } = await getPosts({ tags: [tag] });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Tag", href: "/blog/tag" },
    { label: tag, href: `/blog/tag/${tag}` },
  ];

  return (
    <MainContainer>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex flex-col space-y-4 mt-8">
        <h1 className="text-4xl font-bold">
          Tag:{" "}
          <span className="text-suzuha-teal-500">
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </span>
        </h1>
      </div>

      <section className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((recentPost) => (
            <Link
              key={recentPost.slug}
              href={`/blog/${recentPost.slug}`}
              className="flex flex-col space-y-4 justify-between p-4 rounded-xl 
              bg-neutral-900 hover:bg-neutral-950 transition-colors"
            >
              <Image
                src={
                  recentPost.image ||
                  "/images/placeholder/placeholder-image.jpg"
                }
                alt={recentPost.title}
                width={500}
                height={500}
                className="w-full h-48 object-cover rounded-lg"
              />

              <h2 className="text-xl font-semibold">{recentPost.title}</h2>

              <div className="flex flex-col space-y-3 text-sm">
                <div className="flex flex-col space-y-2">
                  <p className="flex flex-row items-center text-white not-italic">
                    <FaUser className="mr-2" />
                    {recentPost.author}
                  </p>
                  <p className="flex flex-row items-center text-white not-italic">
                    <FaCalendar className="mr-2" />
                    {format(new Date(recentPost.createDate), "yyyy/MM/dd")}
                  </p>
                </div>

                <ul className="flex flex-row flex-wrap gap-2">
                  {recentPost.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MainContainer>
  );
}

export default TagPage;
