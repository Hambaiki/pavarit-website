import {
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

import { CONTACT } from "./config";

export const contactItems = [
  { label: "Email", value: CONTACT.email, icon: FaEnvelope },
  { label: "LinkedIn", value: CONTACT.linkedIn, icon: FaLinkedin },
  { label: "GitHub", value: CONTACT.github, icon: FaGithub },
  { label: "Facebook", value: CONTACT.facebook, icon: FaFacebookF },
  { label: "Instagram", value: CONTACT.instagram, icon: FaInstagram },
  { label: "Twitter", value: CONTACT.twitter, icon: FaTwitter },
];
