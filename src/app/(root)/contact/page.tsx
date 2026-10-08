import { contactItems } from "@/constants/common";

import { FaEnvelope, FaGlobe, FaPhone } from "react-icons/fa6";

import MainContainer from "@/components/container/MainContainer";
import MainHeader from "@/components/common/MainHeader";

function Contact() {
  const email = process.env.NEXT_PUBLIC_EMAIL || "pavarit.wir@gmail.com";
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <MainContainer className="space-y-14">
      <MainHeader
        title="Contact"
        description="Get in touch with me by email or using the contact
          information provided."
        breadcrumbs={breadcrumbs}
      />

      <section className="grid grid-cols-1 gap-12">
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <FaEnvelope className="h-6 w-6 text-accent" />
            <h2>Email Me</h2>
          </div>

          <div className="rounded-xl bg-surface p-4">
            <p>
              For questions and opportunities, send me an email and I’ll get
              back to you as soon as I can.
            </p>
            <a
              href={`mailto:${email}`}
              className="mt-4 inline-flex rounded-lg bg-surface-raised px-4 py-2 hover:bg-surface-muted transition-colors"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <FaPhone className="h-6 w-6 text-accent" />
            <h2>Information</h2>
          </div>

          <div className="bg-surface p-4 rounded-xl space-y-4 text-center">
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
                      w-10 h-10 rounded-full bg-surface-raised hover:bg-surface-muted transition-colors"
                  >
                    <item.icon className="w-5 h-5 group-hover:text-accent transition-colors" />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>
    </MainContainer>
  );
}

export async function generateMetadata() {
  return {
    title: "Contact Pavarit Wiriyakunakorn - Pavarit's Website",
    description:
      "Contact Pavarit Wiriyakunakorn by email or through the contact information provided.",
    keywords: ["Contact", "Pavarit", "Wiriyakunakorn"],
    robots: "index, follow",
    alternates: {
      canonical: "/contact",
    },
  };
}

export default Contact;
