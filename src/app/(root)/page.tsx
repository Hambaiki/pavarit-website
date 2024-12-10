import Button from "@/components/Button";
import MainContainer from "@/components/container/MainContainer";

const Home = () => {
  return (
    <MainContainer>
      <section className="">
        <div className="text-left mb-12">
          <h1 className="text-4xl font-bold">{"Hi! I'm Pavarit"}</h1>
          <h2 className="text-2xl font-semibold text-suzuha-teal-500 mt-1">
            {"Glad to have you here!"}
          </h2>
          <p className="text-xl text-neutral-300 mt-4">
            {"Frontend Developer passionate about developing web application."}
          </p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <p className="text-neutral-300">
            {
              "I specialize in building modern web applications using technologies such as Next.js, React, and Tailwind CSS. With experience in both frontend and backend development, I love turning ideas into reality."
            }
          </p>

          <div className="flex flex-row justify-end gap-4 mt-6">
            <Button
              href="/contact"
              className="w-32 h-12 rounded-lg"
              variant="secondary"
            >
              Get in Touch
            </Button>
            <Button
              href="/blog"
              className="w-48 h-12 rounded-lg"
              variant="primary"
            >
              Explore My Blog
            </Button>
          </div>
        </div>
      </section>
    </MainContainer>
  );
};

export default Home;
