"use client";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema } from "~/types/user.types";
import { useToast } from "~/hooks/use-toast";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { useTranslations } from "next-intl";

interface EditProfileFormProps {
  email?: string | null | undefined;
  name?: string | null | undefined;
  username?: string | null | undefined;
  bio?: string | null | undefined;
  public?: boolean;
  location?: string | null | undefined;
  website?: string | null | undefined;
  twitter?: string | null | undefined;
  instagram?: string | null | undefined;
  facebook?: string | null | undefined;
  linkedin?: string | null | undefined;
  youtube?: string | null | undefined;
  tiktok?: string | null | undefined;
  github?: string | null | undefined;
  discord?: string | null | undefined;
  twitch?: string | null | undefined;
}

export default function EditProfileForm({
  user,
  acceptedMarketing,
}: {
  user: EditProfileFormProps;
  acceptedMarketing: boolean;
}) {
  const { toast } = useToast();
  const t = useTranslations("Profile");

  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      acceptedMarketing: acceptedMarketing,
      username: user.username ?? undefined,
      bio: user.bio ?? undefined,
      public: user.public ?? false,
      location: user.location ?? undefined,
      website: user.website ?? undefined,
      twitter: user.twitter ?? undefined,
      instagram: user.instagram ?? undefined,
      facebook: user.facebook ?? undefined,
      linkedin: user.linkedin ?? undefined,
      youtube: user.youtube ?? undefined,
      tiktok: user.tiktok ?? undefined,
      github: user.github ?? undefined,
      discord: user.discord ?? undefined,
      twitch: user.twitch ?? undefined,
    },
  });

  const { isPending, mutate, data } = api.user.updateProfile.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("profile_updated_success"),
        description: t("profile_updated_success_description"),
      });
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: `${t("error")}: ${error.message}`,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateProfileSchema>) {
    mutate(values);
  }

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormItem>
            <FormLabel>{t("your_email")}</FormLabel>
            <FormControl>
              <Input value={user.email ?? ""} disabled />
            </FormControl>
            <FormDescription>{t("email_cannot_change")}</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("name")} {...field} />
                </FormControl>
                <FormDescription>{t("your_name")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("username")} {...field} />
                </FormControl>
                <FormDescription>{t("username_description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("bio")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("bio")} {...field} />
                </FormControl>
                <FormDescription>{t("your_bio")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("location")} {...field} />
                </FormControl>
                <FormDescription>{t("your_location")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("website")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("website")} {...field} />
                </FormControl>
                <FormDescription>{t("your_website")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Receive Marketing Emails */}
          <FormField
            control={form.control}
            name="acceptedMarketing"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{t("receive_marketing_emails")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  {t("marketing_emails_description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Public Profile */}
          <FormField
            control={form.control}
            name="public"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{t("public_profile")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  {t("public_profile_description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? t("updating") : t("update")}
          </Button>

          {/* Social Links */}
          <h1 className="text-xl font-semibold">{t("social_links")}</h1>

          {/* Facebook */}
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("facebook")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("facebook")} {...field} />
                </FormControl>
                <FormDescription>{t("your_facebook")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instagram */}
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("instagram")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("instagram")} {...field} />
                </FormControl>
                <FormDescription>{t("your_instagram")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Twitter */}
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("twitter")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("twitter")} {...field} />
                </FormControl>
                <FormDescription>{t("your_twitter")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LinkedIn */}
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("linkedin")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("linkedin")} {...field} />
                </FormControl>
                <FormDescription>{t("your_linkedin")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* YouTube */}
          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("youtube")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("youtube")} {...field} />
                </FormControl>
                <FormDescription>{t("your_youtube")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TikTok */}
          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("tiktok")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("tiktok")} {...field} />
                </FormControl>
                <FormDescription>{t("your_tiktok")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GitHub */}
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("github")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("github")} {...field} />
                </FormControl>
                <FormDescription>{t("your_github")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Discord */}
          <FormField
            control={form.control}
            name="discord"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("discord")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("discord")} {...field} />
                </FormControl>
                <FormDescription>{t("your_discord")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Twitch */}
          <FormField
            control={form.control}
            name="twitch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("twitch")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("twitch")} {...field} />
                </FormControl>
                <FormDescription>{t("your_twitch")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? t("updating") : t("update")}
          </Button>
        </form>
      </Form>
    </>
  );
}
