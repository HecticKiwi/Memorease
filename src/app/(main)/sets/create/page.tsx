import FlashcardSetForm from "@/features/flashcards/components/form/flashcardSetForm";

function CreateSetPage() {
  return (
    <div className="mx-auto max-w-screen-lg p-8">
      <h1 className="text-3xl font-bold tracking-tighter">New Flashcard Set</h1>
      <FlashcardSetForm className="mt-12" />
    </div>
  );
}

export default CreateSetPage;
