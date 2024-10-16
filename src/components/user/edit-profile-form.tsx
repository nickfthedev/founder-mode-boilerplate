"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema } from "~/types/user.types";
import { useToast } from "~/hooks/use-toast";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
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

// Function that calls the api to upload the file to the server
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  const data = await response.json();
  return data.fileUrl;
}

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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
    // let avatarUrl = values.avatar;
    // if (avatarFile) {
    //   try {
    //     avatarUrl = await uploadFile(avatarFile);
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //     toast({
    //       title: "Error",
    //       description: `Error uploading file. ${error}`,
    //     });
    //   }
    // }

    mutate({ ...values /*, avatar: avatarUrl */ });
  }

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <>
      <h1 className="text-2xl font-bold">Edit Profile</h1>

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

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>Your name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </form>
      </Form>
    </>
  );
}
