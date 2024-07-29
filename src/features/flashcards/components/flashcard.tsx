import { cn } from "@/lib/utils";
import { Flashcard as FlashcardItem } from "@prisma/client";
import { useState } from "react";

function Flashcard({ flashcard }: { flashcard: FlashcardItem }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => setShowAnswer((prev) => !prev)}
    >
      <div
        className={cn(
          "relative h-[400px] rounded-lg bg-muted p-4 text-center transition-transform duration-300 [transform-style:preserve-3d]",
          showAnswer && "[transform:rotateX(180deg)]",
        )}
      >
        <div className="grid h-full place-content-center text-3xl [backface-visibility:hidden] [transform:rotateX(0deg)]">
          {flashcard.question}
        </div>
        <div className="absolute inset-0 grid h-full place-content-center text-3xl [backface-visibility:hidden] [transform:rotateX(-180deg)]">
          {flashcard.answer}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
