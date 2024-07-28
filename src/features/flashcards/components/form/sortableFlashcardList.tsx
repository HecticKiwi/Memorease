"use client";

import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FlashcardSetSchema } from "./flashcardSetForm";
import SortableFlashcard from "./sortableFlashcard";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import ImportButton from "./importButton";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

function SortableFlashcardList({
  form,
  className,
}: {
  form: UseFormReturn<FlashcardSetSchema>;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { fields, append, remove, swap, move } = useFieldArray({
    control: form.control,
    name: "cards",
    keyName: "key",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);

      updateCardPositions();
    }

    setActiveId(null);
  };

  const updateCardPositions = () => {
    form.getValues("cards").forEach((card, i) => {
      form.setValue(`cards.${i}.position`, i);
    });
  };

  const swapQuestionsAndAnswers = () => {
    form.getValues("cards").forEach((card, i) => {
      form.setValue(`cards.${i}`, {
        ...card,
        question: card.answer,
        answer: card.question,
      });
    });
  };

  return (
    <>
      <div className={cn("flex items-center", className)}>
        <ImportButton flashCardsLength={fields.length} append={append} />

        <Button
          size={"icon"}
          variant={"secondary"}
          className="ml-auto"
          type="button"
          onClick={() => swapQuestionsAndAnswers()}
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          <div className="my-7 space-y-4">
            {fields.map((field, index) => (
              <SortableFlashcard
                key={field.id}
                form={form}
                field={field}
                remove={remove}
                updateCardPositions={updateCardPositions}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <SortableFlashcard
              key={activeId}
              form={form}
              field={fields.find((field) => field.id === activeId)!}
              remove={remove}
              updateCardPositions={updateCardPositions}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Button
        type="button"
        variant={"secondary"}
        disabled={form.formState.isSubmitting}
        className="w-full"
        onClick={() =>
          append({
            id: uuidv4(),
            question: "",
            answer: "",
            position: form.getValues("cards").length,
          })
        }
      >
        Add Card
      </Button>

      {(form.formState.errors.cards?.root || form.formState.errors.cards) && (
        <p className="text-sm font-medium text-destructive">
          {form.formState.errors.cards?.root?.message ||
            form.formState.errors.cards.message}
        </p>
      )}
    </>
  );
}

export default SortableFlashcardList;
