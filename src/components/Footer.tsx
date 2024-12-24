import { contactItems } from "@/constants/common";

function Footer() {
  return (
    <div className="w-full">
      <div
        className="flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 py-6 md:p-8 md:py-10 
          space-y-4 space-x-0 md:space-y-0 md:space-x-8"
      >
        <div className="flex flex-col w-full md:flex-row gap-6 justify-between items-center">
          {/* <Image
              src="/images/logo/pw/pw-light.svg"
              alt="PAVARIT W."
              width={100}
              height={100}
              className="w-24 h-24"
            /> */}
          {/* <h3>PAVARIT</h3> */}
          <div className="flex flex-col space-y-1 text-center md:text-left">
            <h4>Developed by Pavarit W.</h4>
            <p>Built with Next.js, Tailwind CSS, Vercel, and Neon.</p>
          </div>

          <div className="flex flex-row flex-wrap gap-3 justify-center">
            {contactItems
              .filter((item) => item.value)
              .map((item, index) => (
                <a
                  key={index}
                  href={item.value}
                  target="_blank"
                  className="group flex flex-row items-center justify-center 
                      w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="w-5 h-5 group-hover:text-suzuha-teal-500 transition-colors" />
                </a>
              ))}
          </div>

          {/* <p>
              This website is under development. If you have any questions,
              please contact me.
            </p> */}
        </div>
      </div>
    </div>
  );
}

export default Footer;
