import ContactForm, {
  ReCaptchaProvider,
} from "~/components/contact/contact-form";

export default function ContactPage() {
  return (
    <ReCaptchaProvider>
      <ContactForm />
    </ReCaptchaProvider>
  );
}
