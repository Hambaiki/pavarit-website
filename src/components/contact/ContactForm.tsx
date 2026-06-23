"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/Button";
import { TextInput, Textarea } from "@/components/form/v2";
import Card from "@/components/ui/Card";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function ContactForm() {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: ContactFormValues) {
    setError(undefined);

    try {
      const response = await fetch("/api/v1/inquiries", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        reset();
      } else if (response.status === 429) {
        setError("Too many submissions, please try again later.");
      } else {
        setError(
          "An error occurred while sending the message. Please try again."
        );
      }
    } catch {
      setError(
        "An error occurred while sending the message. Please try again."
      );
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="flex flex-col space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Name"
              placeholder="Your Name"
              autoComplete="name"
              required
              error={errors.name?.message}
              {...register("name")}
            />
            <TextInput
              label="Email"
              placeholder="Your Email"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register("email")}
            />
            <TextInput
              label="Phone Number (Optional)"
              placeholder="Your Phone Number"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <TextInput
              label="Subject (Optional)"
              placeholder="Subject e.g. Job Inquiry"
              autoComplete="off"
              error={errors.subject?.message}
              {...register("subject")}
            />
          </div>

          <Textarea
            label="Message"
            placeholder="Your Message"
            autoComplete="off"
            className="min-h-40"
            required
            error={errors.message?.message}
            {...register("message")}
          />

          <div className="flex justify-end">
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="px-4 py-2 rounded-lg"
            >
              {isSubmitting ? "Sending..." : "Send a message"}
            </Button>
          </div>
        </Card>
      </form>

      <Modal
        open={error !== undefined}
        onOpenChange={(open) => {
          if (!open) setError(undefined);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Error</ModalTitle>
            <ModalDescription>{error}</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="px-4 py-2 rounded-lg text-sm">
                Understood
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        open={success}
        onOpenChange={(open) => {
          if (!open) setSuccess(false);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Message Sent</ModalTitle>
            <ModalDescription>
              Your message has been sent successfully. Thank you for your
              interest.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="px-4 py-2 rounded-lg text-sm">
                Understood
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ContactForm;
