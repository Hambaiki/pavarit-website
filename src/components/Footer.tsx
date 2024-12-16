import { contactItems, navItems } from "@/constants/common";

function Footer() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row max-w-5xl w-full mx-auto p-4 md:p-8 space-y-4 space-x-0 md:space-y-0 md:space-x-8">
        <div className="flex-1 space-y-2">
          <div className="flex flex-col space-y-1">
            {/* <Image
              src="/images/logo/pw/pw-light.svg"
              alt="PAVARIT W."
              width={100}
              height={100}
              className="w-24 h-24"
            /> */}
            <h2 className="text-2xl font-semibold text-neutral-300">
              PAVARIT W.
            </h2>
            <p className="text-sm text-neutral-300">Developed by Pavarit W.</p>
            <p className="text-sm text-neutral-500">
              This website is under development. If you have any questions,
              please contact me.
            </p>
          </div>
        </div>

        {/* <div className="flex flex-row space-x-8 bg-neutral-800 p-4 rounded-xl">
          <div className="flex-1 flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-neutral-300">Links</h3>
            <ul className="grid grid-cols-1 gap-2 list-inside list-disc">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-base text-neutral-400 hover:text-suzuha-teal-500 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-neutral-300">Contact</h3>
            <ul className="grid grid-cols-1 gap-2 list-inside list-disc">
              {contactItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-base text-neutral-400 hover:text-suzuha-teal-500 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Footer;
