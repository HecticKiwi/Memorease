"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { FlashcardSetWithCards, upsertFlashcardSet } from "../../server";
import SortableFlashcardList from "./sortableFlashcardList";
import { useIsClient } from "@uidotdev/usehooks";
import { DevTool } from "@hookform/devtools";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ImportButton from "./importButton";
import { Textarea } from "@/components/ui/textarea";

export const flashcardSetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  cards: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
        position: z.number(),
      }),
    )
    .min(2, "At least 2 cards are required"),
});

export type FlashcardSetSchema = z.infer<typeof flashcardSetSchema>;

function FlashcardSetForm({
  initialValues,
  className,
}: {
  initialValues?: FlashcardSetWithCards;
  className?: string;
}) {
  const isClient = useIsClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof flashcardSetSchema>>({
    resolver: zodResolver(flashcardSetSchema),
    defaultValues: initialValues || {
      title: "Title",
      description: "",
      cards: [
        {
          id: uuidv4(),
          question: "",
          answer: "",
          position: 0,
        },
        {
          id: uuidv4(),
          question: "",
          answer: "",
          position: 1,
        },
      ],
    },
  });

  if (!isClient) {
    return null;
  }

  async function onSubmit(values: FlashcardSetSchema) {
    const newId = await upsertFlashcardSet({
      id: initialValues?.id,
      data: values,
    });

    router.push(`/sets/${newId}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your set..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SortableFlashcardList className="mt-6" form={form} />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="ml-auto mt-8 block"
        >
          {initialValues ? "Done" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default FlashcardSetForm;
