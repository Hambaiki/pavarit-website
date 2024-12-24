import {
  FaEnvelope,
  FaLinkedin,
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaTwitter,
} from "react-icons/fa6";

export const contactItems = [
  { label: "Email", value: process.env.NEXT_PUBLIC_EMAIL, icon: FaEnvelope },
  { label: "Phone", value: process.env.NEXT_PUBLIC_PHONE, icon: FaPhone },
  {
    label: "Facebook",
    value: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    icon: FaFacebookF,
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
