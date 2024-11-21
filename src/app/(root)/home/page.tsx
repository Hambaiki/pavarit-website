import React from "react";

const Home = () => {
  return (
    <main className="py-8">
      <section>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{"Welcome! I'm Pavarit"}</h1>
          <p className="text-xl text-neutral-300">
            {
              "Frontend Developer passionate about creating meaningful web experiences"
            }
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          <div className="bg-neutral-950 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-neutral-300">
              {
                "I specialize in building modern web applications using technologies such as Next.js, React, and Tailwind CSS. With experience in both frontend and backend development, I love turning ideas into reality."
              }
            </p>
          </div>

          {/* <div className="bg-neutral-950 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
            <ul className="list-disc list-inside text-neutral-300">
              <li>Project 1 - Brief description</li>
              <li>Project 2 - Brief description</li>
              <li>Project 3 - Brief description</li>
            </ul>
          </div> */}
        </div>

        <div className="text-center mt-12">
          <a
            href="/contact"
            className="inline-block bg-neutral-950 text-neutral-100 px-6 py-3 rounded-full hover:bg-neutral-900 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
