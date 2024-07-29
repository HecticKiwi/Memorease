"use client ";

import CircleProgress from "@/components/circleProgress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { TbCardsFilled } from "react-icons/tb";
import { FlashcardRecord } from "./flashcards";
import useWindowSize from "@/hooks/useWindowSize";

function FlashcardsResults({
  trackProgress,
  flashcardRecords,
  flashcardTotal,
  reviewCards,
  restartCards,
  className,
}: {
  trackProgress: boolean;
  flashcardRecords: FlashcardRecord[];
  flashcardTotal: number;
  reviewCards: () => void;
  restartCards: () => void;
  className?: string;
}) {
  const size = useWindowSize();
  const correctPercentage =
    ((flashcardTotal -
      flashcardRecords.filter((record) => !record.correct).length) /
      flashcardTotal) *
    100;

  const message = !trackProgress
    ? "Way to go! You've reviewed all the cards."
    : correctPercentage === 100
      ? "Wow, you know your stuff! You've sorted all the cards."
      : correctPercentage >= 80
        ? "Amazing You're almost there."
        : correctPercentage >= 60
          ? "You're crushing it! Don't stop now."
          : correctPercentage >= 40
            ? "You're getting there! Keep going so you really get it."
            : "You're doing great! Keep it up to build confidence.";

  const stillLearning = flashcardRecords.filter(
    (record) => !record.correct,
  ).length;
  const know = flashcardTotal - stillLearning;

  return (
    <>
      <div className={cn(className)}>
        <Confetti
          recycle={false}
          numberOfPieces={300}
          run={correctPercentage === 100}
          width={size.clientWidth || undefined}
          height={size.height || undefined}
          className="absolute"
        />
        <h2 className="text-3xl font-bold">{message}</h2>

        <div className="mt-6 grid gap-12 md:grid-cols-2">
          <div>
            <div className="text-lg font-semibold">How you're doing</div>

            <div className="mt-6 flex gap-8">
              <CircleProgress
                className="flex-shrink-0"
                value={correctPercentage}
              />

              <div className="col-span-2 flex flex-1 flex-col gap-3">
                {trackProgress && (
                  <>
                    <div className="flex justify-between rounded-full bg-green-300/25 p-2 px-3 text-sm font-semibold text-green-300">
                      <span>Know</span>
                      <span>{know}</span>
                    </div>
                    <div className="flex justify-between rounded-full bg-orange-300/25 p-2 px-3 text-sm font-semibold text-orange-300">
                      <span>Still learning</span>
                      <span>{stillLearning}</span>
                    </div>
                  </>
                )}
                {!trackProgress && (
                  <div className="flex justify-between rounded-full bg-green-300/25 p-2 px-3 text-sm font-semibold text-green-300">
                    <span>Completed</span>
                    <span>{know}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold">Next steps</div>

            <div className="mt-6 flex flex-col gap-4">
              {stillLearning > 0 && (
                <Button className="w-full gap-2" onClick={() => reviewCards()}>
                  <TbCardsFilled className="h-5 w-5" />
                  <span>Review the tough terms</span>
                </Button>
              )}

              <Button
                className="w-full"
                variant={"secondary"}
                onClick={() => restartCards()}
              >
                <span>Restart Flashcards</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlashcardsResults;
