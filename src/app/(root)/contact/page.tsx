import ContactForm from "@/components/contact/ContactForm";
import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import {
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTwitter,
} from "react-icons/fa6";

function Contact() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  const contactItems = [
    { label: "Email", value: process.env.NEXT_PUBLIC_EMAIL, icon: FaEnvelope },
    { label: "Phone", value: process.env.NEXT_PUBLIC_PHONE, icon: FaPhone },
    {
      label: "Facebook",
      value: process.env.NEXT_PUBLIC_FACEBOOK_URL,
      icon: FaFacebook,
    },
    {
      label: "Instagram",
      value: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      icon: FaInstagram,
    },
    {
      label: "Twitter",
      value: process.env.NEXT_PUBLIC_TWITTER_URL,
      icon: FaTwitter,
    },
    {
      label: "LinkedIn",
      value: process.env.NEXT_PUBLIC_LINKEDIN_URL,
      icon: FaLinkedin,
    },
  ];

  return (
    <MainContainer>
      <header>
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Contact</h1>
          <p className="text-neutral-300">
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
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>

          <div className="bg-neutral-900 p-4 rounded-xl space-y-4 text-center">
            <p className="text-lg">
              pavarit.wir@gmail.com
              <br />
              <span className="text-neutral-300">(+66) 84-682-2428</span>
            </p>

            <p className="text-base">
              <span className="text-neutral-300">Bangkok, Thailand</span>
            </p>

            <div className="flex flex-row flex-wrap gap-3 justify-center">
              {contactItems
                .filter((item) => item.value)
                .map((item, index) => (
                  <a
                    key={index}
                    href={item.value}
                    target="_blank"
                    className="flex flex-row items-center justify-center 
                      w-10 h-10 rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
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
