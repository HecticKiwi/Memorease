import { Button } from "@/components/ui/button";
import FlashcardSetForm, {
  flashcardSetSchema,
} from "@/features/flashcards/components/form/flashcardSetForm";
import { getFlashcardSet } from "@/features/flashcards/server";
import { validateRequest } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function EditSetPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { user } = await validateRequest();

  if (!user) {
    return notFound();
  }

  const flashcardSetForm = await getFlashcardSet(Number(params.id));

  if (!flashcardSetForm || flashcardSetForm.authorId !== user.id) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-screen-lg p-8">
      <div className="flex justify-between">
        <Button variant={"link"} asChild className="p-0">
          <Link href={`/sets/${params.id}`} className="flex gap-2">
            <ChevronLeft />
            <span>Back to set</span>
          </Link>
        </Button>
      </div>

      <FlashcardSetForm className="mt-12" initialValues={flashcardSetForm} />
    </div>
  );
}

export default EditSetPage;
