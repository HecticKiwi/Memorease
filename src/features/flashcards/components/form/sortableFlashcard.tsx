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
import Flashcard from "./flashcard";
import { CSSRuleObject } from "tailwindcss/types/config";
import { CSSProperties } from "react";

function SortableFlashcard({
  form,
  field,
  remove,
  updateCardPositions,
}: {
  form: UseFormReturn<FlashcardSetSchema>;
  field: FieldArrayWithId<FlashcardSetSchema, "cards">;
  remove: UseFieldArrayRemove;
  updateCardPositions: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? "0" : "1",
  };

  return (
    <>
      <Flashcard
        form={form}
        field={field}
        remove={remove}
        updateCardPositions={updateCardPositions}
        ref={setNodeRef}
        style={style}
        attributes={attributes}
        listeners={listeners}
      />
    </>
  );
}

export default SortableFlashcard;
