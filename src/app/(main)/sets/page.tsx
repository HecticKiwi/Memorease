import { Button } from "@/components/ui/button";
import FlashcardSetInfiniteList from "@/features/flashcards/components/flashCardSetInfiniteList";
import { getFlashcardSets } from "@/features/flashcards/server";
import Link from "next/link";

async function SetsPage() {
  const sets = await getFlashcardSets({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!sets.sets.length) {
    return (
      <main className="text-center">
        <h1 className="mt-32 text-3xl font-semibold">
          You don't have any flashcard sets.
        </h1>

        <Button className="mt-8" asChild>
          <Link href={"/sets/create"}>Create set</Link>
        </Button>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <h1 className="mb-12 text-3xl font-bold tracking-tighter">Your Sets</h1>
        <FlashcardSetInfiniteList sets={sets} />
      </main>
    </>
  );
}

export default SetsPage;
