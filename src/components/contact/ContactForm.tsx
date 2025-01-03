"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import TextInput from "@/components/form/TextInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import GeneralModal from "@/components/common/GeneralModal";

function ContactForm() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (formData.name && formData.email && formData.message) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [formData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!formValid) {
        setError("Please fill in all fields");
        return;
      } else {
        setError(undefined);
      }

      const response = await fetch("/api/v1/inquiries", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else if (response.status === 429) {
        setError("Too many submissions, please try again later.");
      } else {
        setError(
          "An error occurred while sending the message. Please try again."
        );
      }
    } catch (error) {
      setError(
        "An error occurred while sending the message. Please try again."
      );
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4 rounded-xl bg-gray-850 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Name"
              name="name"
              placeholder="Your Name"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextInput
              label="Email"
              name="email"
              placeholder="Your Email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <TextInput
              label="Phone Number (Optional)"
              name="phone"
              placeholder="Your Phone Number"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextInput
              label="Subject (Optional)"
              name="subject"
              placeholder="Subject e.g. Job Inquiry"
              autoComplete="off"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <TextAreaInput
            label="Message"
            name="message"
            placeholder="Your Message"
            autoComplete="off"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="min-h-[10rem]"
            required
          />

          <div className="flex justify-end">
            <Button
              disabled={!formValid}
              type="submit"
              className="px-4 py-2 rounded-lg"
            >
              Send a message
            </Button>
          </div>
        </div>
      </form>

      <GeneralModal
        visible={error !== undefined}
        title="Error"
        message={error}
        primaryButtonText="Understood"
        onClickOutside={() => setError(undefined)}
        onClickPrimary={() => setError(undefined)}
      />

      <GeneralModal
        visible={success}
        title="Message Sent"
        message="Your message has been sent successfully. Thank you for your interest."
        primaryButtonText="Understood"
        onClickOutside={() => setSuccess(false)}
        onClickPrimary={() => setSuccess(false)}
      />
    </>
  );
}

export default ContactForm;
