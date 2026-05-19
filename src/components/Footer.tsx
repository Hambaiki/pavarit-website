import { contactItems } from "@/constants/common";

function Footer() {
  return (
    <div className="w-full">
      <div
        className="flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 py-6 md:p-8 md:py-10 
          space-y-4 space-x-0 md:space-y-0 md:space-x-8"
      >
        <div className="flex flex-col w-full md:flex-row gap-6 justify-between items-center">
          <div className="flex flex-col space-y-1 text-center md:text-left">
            <p className="font-bold text-lg text-gray-700">
              Developed by Pavarit W.
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, Tailwind CSS, Vercel, and Neon.
            </p>
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
                      w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <item.icon className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
