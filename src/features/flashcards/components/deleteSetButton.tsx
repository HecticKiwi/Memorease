"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteFlashcardSet } from "../server";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Tooltip from "@/components/tooltip";

function DeleteSetButton({ flashcardSetId }: { flashcardSetId: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <AlertDialog>
        <Tooltip content="Delete">
          <AlertDialogTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="ml-3">
              <Trash className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flashcard Set</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flashcard set? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);

                try {
                  await deleteFlashcardSet(flashcardSetId);
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: "Failed to delete the flashcard set.",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeleteSetButton;
