import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";
import RecentPosts from "@/components/post/RecentPosts";
import { introItems } from "@/constants/home";
import Image from "next/image";

const Home = () => {
  return (
    <>
      <div className="relative w-full overflow-hidden">
        <Image
          src="/images/profile/pavarit.jpg"
          alt="Profile"
          width={500}
          height={500}
          className="w-full h-96 object-cover object-center brightness-[.25] blur-lg"
        />

        <div className="absolute top-0 left-0 w-full h-96">
          <Image
            src="/images/profile/pavarit.jpg"
            alt="Profile"
            width={1500}
            height={1500}
            className="h-full w-full max-w-5xl mx-auto object-cover object-center brightness-[.40]"
          />
        </div>

        <div className="absolute top-0 left-0 flex flex-col justify-center w-full h-full">
          <div className="w-full max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-bold">{"Hi! I'm Pavarit"}</h1>
            <h2 className="text-2xl font-semibold text-suzuha-teal-500 mt-1">
              {"Glad to have you here!"}
            </h2>
            <p className="text-xl text-neutral-300 mt-4">
              {
                "Frontend Developer passionate about developing web application."
              }
            </p>

            <div className="flex flex-row gap-4 mt-6">
              <Button
                href="/contact"
                className="w-32 h-12 rounded-lg"
                variant="secondary"
              >
                Get in Touch
              </Button>
              <Button
                href="/about"
                className="w-32 h-12 rounded-lg"
                variant="primary"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MainContainer>
        <section className="p-4 bg-neutral-900 rounded-xl">
          <h2 className="text-3xl font-bold text-suzuha-teal-500 mt-1">
            Welcome to My Corner of the Web!
          </h2>
          <p className="text-lg text-neutral-300 mt-4">
            {`This is a space where I share my journey, ideas, and discoveries.
            Whether you're here to learn, be inspired, or simply explore, you're
            in the right place.`}
          </p>
          <p className="text-lg text-neutral-300 mt-4">
            {`Discover more about myself with a collection of topics ranging from
            personal growth and creative projects to technical tutorials and
            deep thoughts about life. This is a place where I share my journey
            and experiences for exploration and connection.`}
          </p>
        </section>

        <section className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">
            Explore My Latest Articles
          </h3>

          <RecentPosts />
        </section>

        {/* <section className="mt-8 p-4 bg-neutral-900 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">
            What Will You Find Here?
          </h3>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li className="text-base text-neutral-300">
              <span className="font-bold text-white">In-Depth Articles:</span>{" "}
              Detailed posts on topics I’m passionate about, ranging from coding
              tips to personal reflections.
            </li>
            <li className="text-base text-neutral-300">
              <span className="font-bold text-white">Creative Projects:</span>{" "}
              Showcasing my artistic ventures, from digital art to storytelling.
            </li>
            <li className="text-base text-neutral-300">
              <span className="font-bold text-white">Resource Hub:</span>{" "}
              Curated tools, links, and guides to help you on your journey.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4 mt-8">
            Why I Built This Place
          </h3>
          <p className="text-base text-neutral-300 mt-4">
            In a world overflowing with content, I wanted to carve out a small
            sanctuary—a personal space where I can share my authentic self and
            connect with others.
          </p>
          <p className="text-base text-neutral-300 mt-4">
            This site is not just about sharing; it’s about growth. It’s about
            learning from experiences, embracing creativity, and finding joy in
            the little things. I hope you find something here that resonates
            with you.
          </p>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Let's Connect!</h3>
          <p className="text-base text-neutral-300 mt-4">
            I’d love to hear from you! Feel free to{" "}
            <a
              href="/contact"
              className="text-suzuha-teal-400 hover:text-suzuha-teal-300 underline"
            >
              reach out
            </a>{" "}
            with your thoughts, feedback, or just to say hi.
          </p>
        </section> */}

        <section className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">More Content</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {introItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col space-y-4 p-4 min-h-[16rem] bg-neutral-900 rounded-xl"
              >
                <div className="flex-1 flex flex-col space-y-2">
                  <h2 className="text-2xl font-semibold">{item.title}</h2>
                  <p className="text-neutral-300">{item.description}</p>
                </div>

                <Button
                  href={item.href}
                  className="w-full h-12 rounded-lg"
                  variant="secondary"
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </section>
      </MainContainer>
    </>
  );
};

export default Home;
