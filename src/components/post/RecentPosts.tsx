import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { FaCalendar, FaUser } from "react-icons/fa6";

import { getRecentPosts } from "@/lib/posts";

async function RecentPosts() {
  const posts = await getRecentPosts();

  return (
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
              recentPost.image || "/images/placeholder/placeholder-image.jpg"
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
                {format(new Date(recentPost.date), "yyyy/MM/dd")}
              </p>
            </div>

            <ul className="flex flex-row flex-wrap gap-2">
              {recentPost.tags.map((tag, index) => (
                <li
                  key={index}
                  className="text-sm text-neutral-300 rounded-full px-3 py-1 bg-neutral-800"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="p-4 bg-neutral-800 rounded-lg">
            <p className="text-neutral-300">{recentPost.description}</p>
          </div> */}
        </Link>
      ))}
    </div>
  );
}

export default RecentPosts;
