"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { FlashcardSetSchema } from "./flashcardSetForm";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ForwardedRef, forwardRef } from "react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const Flashcard = forwardRef(
  (
    {
      form,
      field,
      remove,
      updateCardPositions,
      style,
      attributes,
      listeners,
    }: {
      form: UseFormReturn<FlashcardSetSchema>;
      field: FieldArrayWithId<FlashcardSetSchema, "cards">;
      remove: UseFieldArrayRemove;
      updateCardPositions: () => void;
      style?: CSSProperties;
      attributes?: DraggableAttributes;
      listeners?: SyntheticListenerMap;
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const fieldsPosition = form
      .getValues("cards")
      .findIndex((card) => card.id === field.id);

    return (
      <>
        <div
          key={field.id}
          ref={ref}
          className="rounded-lg border bg-background"
          style={style}
        >
          <div
            className="flex items-center border-b p-4"
            {...attributes}
            {...listeners}
          >
            <span className="mr-auto text-lg font-semibold">
              {field.position}
            </span>

            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              className="h-8 w-8"
              onClick={() => {
                remove(fieldsPosition);
                updateCardPositions();
              }}
              disabled={form.formState.isSubmitting}
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid gap-6 p-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={`cards.${fieldsPosition}.question`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`cards.${fieldsPosition}.answer`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </>
    );
  },
);

Flashcard.displayName = "Flashcard";

export default Flashcard;
