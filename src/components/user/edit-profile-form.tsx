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
        title: "Profile updated successfully.",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error: ${error.message}`,
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
            <FormLabel>Your Email</FormLabel>
            <FormControl>
              <Input value={user.email ?? ""} disabled />
            </FormControl>
            <FormDescription>You cannot change your email.</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormDescription>Your name</FormDescription>
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
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                  Your username. Must be unique. Will be used for your public
                  profile link.
                </FormDescription>
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
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Bio" {...field} />
                </FormControl>
                <FormDescription>Your bio</FormDescription>
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormDescription>Your location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Website" {...field} />
                </FormControl>
                <FormDescription>Your website</FormDescription>
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
                  <FormLabel>Receive Marketing Emails</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  You will receive marketing emails from us.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*
           * Public Profile
           */}
          <FormField
            control={form.control}
            name="public"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Public Profile</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  If enabled, your profile will be visible to everyone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Updating..." : "Update"}
          </Button>
          {/*
           * Social Links
           */}

          <h1 className="text-xl font-semibold">Social Links</h1>
          {/* Facebook */}
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="Facebook" {...field} />
                </FormControl>
                <FormDescription>Your Facebook page</FormDescription>
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
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="Instagram" {...field} />
                </FormControl>
                <FormDescription>Your Instagram page</FormDescription>
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
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="Twitter" {...field} />
                </FormControl>
                <FormDescription>Your Twitter page</FormDescription>
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
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="LinkedIn" {...field} />
                </FormControl>
                <FormDescription>Your LinkedIn page</FormDescription>
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
                <FormLabel>YouTube</FormLabel>
                <FormControl>
                  <Input placeholder="YouTube" {...field} />
                </FormControl>
                <FormDescription>Your YouTube page</FormDescription>
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
                <FormLabel>TikTok</FormLabel>
                <FormControl>
                  <Input placeholder="TikTok" {...field} />
                </FormControl>
                <FormDescription>Your TikTok page</FormDescription>
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
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="GitHub" {...field} />
                </FormControl>
                <FormDescription>Your GitHub page</FormDescription>
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
                <FormLabel>Discord</FormLabel>
                <FormControl>
                  <Input placeholder="Discord" {...field} />
                </FormControl>
                <FormDescription>Your Discord page</FormDescription>
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
                <FormLabel>Twitch</FormLabel>
                <FormControl>
                  <Input placeholder="Twitch" {...field} />
                </FormControl>
                <FormDescription>Your Twitch page</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Updating..." : "Update"}
          </Button>
        </form>
      </Form>
    </>
  );
}
