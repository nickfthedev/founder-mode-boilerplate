"use client";
import { Link } from "~/i18n/routing";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [consent, setConsent] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const handleAccept = () => {
    setConsent(true);
    setCookie("consent", "true");
  };

  const handleDecline = () => {
    setConsent(false);
    setCookie("consent", "false");
  };

  useEffect(() => {
    const consent = getCookie("consent");

    if (consent != undefined) {
      setConsent(consent === "true");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (consent === true) {
      // Tracking goes here
      console.log("Tracking goes here");
      // const umamiWebsiteKey = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_KEY;
      // if (umamiWebsiteKey) {
      //   // Add Umami
      //   const umamiScript = document.createElement("script");
      //   umamiScript.src = process.env.NEXT_PUBLIC_UMAMI_URL;
      //   umamiScript.defer = true;
      //   umamiScript.setAttribute("data-website-id", umamiWebsiteKey);
      //   document.body.appendChild(umamiScript);
      // }
      // // Add Google Analytics
      // const gtagId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
      // if (gtagId) {
      //   const gtagScript = document.createElement("script");
      //   gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
      //   gtagScript.async = true;
      //   document.head.appendChild(gtagScript);
      //   const gTagTwo = document.createElement("script");
      //   gTagTwo.innerHTML = `
      //     window.dataLayer = window.dataLayer || [];
      //     function gtag(){dataLayer.push(arguments);}
      //     gtag('js', new Date());
      //     gtag('config', '${gtagId}');
      //   `;
      //   document.head.appendChild(gTagTwo);
      // }
    }
  }, [consent]);

  if (consent != undefined || loading) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 w-full bg-muted/90 backdrop-blur-sm">
      <div className="flex w-full flex-col items-center gap-4 p-4 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-base-content max-w-4xl text-sm leading-6">
            <span className="font-semibold">{t("title")}</span>
            <br />
            {t("description")}{" "}
            <Link className="font-semibold text-primary" href="/legal/privacy">
              {t("link")}
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
          <Button variant={"default"} onClick={handleAccept}>
            {t("accept")}
          </Button>
          <Button
            variant={"default"}
            className="border border-red-500 bg-muted text-muted-foreground hover:bg-red-500 hover:text-white hover:ring-red-500"
            onClick={handleDecline}
          >
            {t("decline")}
          </Button>
        </div>
      </div>
    </div>
  );
}
