import { contactItems } from "@/constants/common";

import ContactForm from "@/components/contact/ContactForm";
import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

function Contact() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <MainContainer>
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1>Contact</h1>
          <p>
            If you have any questions or comments, please fill out the form
            below.
          </p>
        </div>
      </header>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <ContactForm />
        </div>

        <div className="col-span-1">
          <h2 className="mb-4">Contact Information</h2>

          <div className="bg-gray-850 p-4 rounded-xl space-y-4 text-center">
            <p className="text-lg">
              pavarit.wir@gmail.com
              <br />
              (+66) 84-682-2428
            </p>

            <p className="text-base">Bangkok, Thailand</p>

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
          </div>
        </div>
      </section>
    </MainContainer>
  );
}

export default Contact;
