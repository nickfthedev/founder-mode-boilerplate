"use client";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
  FormDescription,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStorySchema } from "../stories.types";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function NewStoryForm() {
  const form = useForm<z.infer<typeof CreateStorySchema>>({
    resolver: zodResolver(CreateStorySchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { mutate } = api.story.createStory.useMutation();
  async function onSubmit(values: z.infer<typeof CreateStorySchema>) {
    mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Input
                  placeholder="For example: A unicorn travelling to the moon"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the prompt that will be used to generate the story.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
