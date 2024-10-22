import ContactForm, {
  ReCaptchaProvider,
} from "~/components/contact/contact-form";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <ReCaptchaProvider>
      <ContactForm />
    </ReCaptchaProvider>
  );
}
