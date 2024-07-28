"use client";

import { cn, shuffleArray } from "@/lib/utils";
import { useRef, useState } from "react";
import Flashcard from "./flashcard";
import { Flashcard as FlashcardItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Check,
  Shuffle,
  Undo,
  Undo2,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { current, produce } from "immer";
import { TbCardsFilled } from "react-icons/tb";
import CircleProgress from "@/components/circleProgress";
import React from "react";
import Confetti from "react-confetti";
import FlashcardsResults from "./flashcardsResults";
import { Toggle } from "@/components/ui/toggle";
import Tooltip from "@/components/tooltip";

export type FlashcardRecord = {
  flashcard: FlashcardItem;
  correct: boolean;
};

function Flashcards({
  className,
  flashcards,
}: {
  className?: string;
  flashcards: FlashcardItem[];
}) {
  const [trackProgress, setTrackProgress] = useState(false);
  const [flashcardSubset, setFlashcardSubset] = useState(flashcards);
  const [flashcardRecords, setFlashcardRecords] = useState<FlashcardRecord[]>(
    [],
  );
  const [shouldShuffle, setShouldShuffle] = useState(false);

  const setShuffle = (shuffle: boolean) => {
    setShouldShuffle(shuffle);

    if (shuffle) {
      setFlashcardSubset(produce((prev) => shuffleArray(prev)));
    } else {
      const flashcardsMap = new Map(
        flashcards.map((element, index) => [element.id, index]),
      );

      setFlashcardSubset(
        produce((prev) => {
          prev.sort(
            (a, b) =>
              (flashcardsMap.get(a.id) ?? -1) - (flashcardsMap.get(b.id) ?? -1),
          );
        }),
      );
    }

    setFlashcardRecords([]);
  };

  if (flashcardRecords.length === flashcardSubset.length) {
    return (
      <FlashcardsResults
        trackProgress={trackProgress}
        flashcardRecords={flashcardRecords}
        flashcardTotal={flashcards.length}
        reviewCards={() => {
          if (shouldShuffle) {
            setFlashcardSubset(
              produce((prev) => {
                return shuffleArray(
                  [...flashcardRecords]
                    .filter((record) => !record.correct)
                    .map((record) => record.flashcard),
                );
              }),
            );
          } else {
            setFlashcardSubset(
              flashcardRecords
                .filter((record) => !record.correct)
                .map((record) => record.flashcard),
            );
          }

          setFlashcardRecords([]);
        }}
        restartCards={() => {
          if (shouldShuffle) {
            setFlashcardSubset(
              produce((prev) => shuffleArray([...flashcards])),
            );
          } else {
            setFlashcardSubset(flashcards);
          }

          setFlashcardRecords([]);
        }}
        className={className}
      />
    );
  }

  return (
    <div className={cn(className)}>
      <Flashcard flashcard={flashcardSubset[flashcardRecords.length]} />

      <div className="mt-5 grid grid-cols-2 gap-8 sm:grid-cols-[1fr_150px_1fr]">
        <div className="flex items-center gap-3">
          <Label htmlFor="track-progress">Track progress</Label>
          <Switch
            id="track-progress"
            checked={trackProgress}
            onCheckedChange={setTrackProgress}
          />
        </div>

        {trackProgress && (
          <>
            <div className="flex max-w-[100px] items-center justify-between md:max-w-[200px]">
              <Tooltip content="Still learning">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => {
                    setFlashcardRecords(
                      produce((prev) => {
                        prev.push({
                          flashcard: flashcardSubset[flashcardRecords.length],
                          correct: false,
                        });
                      }),
                    );
                  }}
                >
                  <X />
                </Button>
              </Tooltip>

              <span className="">
                {flashcardRecords.length + 1} / {flashcardSubset.length}
              </span>

              <Tooltip content="Know">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => {
                    setFlashcardRecords(
                      produce((prev) => {
                        prev.push({
                          flashcard: flashcardSubset[flashcardRecords.length],
                          correct: true,
                        });
                      }),
                    );
                  }}
                >
                  <Check />
                </Button>
              </Tooltip>
            </div>
            <div className="flex justify-end gap-3">
              <Tooltip content={"Undo"}>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  disabled={flashcardRecords.length === 0}
                  onClick={() => {
                    setFlashcardRecords(
                      produce((prev) => {
                        prev.pop();
                      }),
                    );
                  }}
                >
                  <Undo2 />
                </Button>
              </Tooltip>

              <Tooltip content="Shuffle">
                <div>
                  <Toggle
                    pressed={shouldShuffle}
                    aria-label="Toggle shuffle"
                    className="h-10 w-10 p-0"
                    onPressedChange={(value) => setShuffle(value)}
                  >
                    <Shuffle />
                  </Toggle>
                </div>
              </Tooltip>
            </div>
          </>
        )}

        {!trackProgress && (
          <>
            <div className="-order-1 col-span-2 flex items-center justify-between sm:-order-none sm:col-span-1">
              <Button
                variant={"outline"}
                size={"icon"}
                disabled={flashcardRecords.length === 0}
                onClick={() => {
                  setFlashcardRecords(
                    produce((prev) => {
                      prev.pop();
                    }),
                  );
                }}
              >
                <ArrowLeft />
              </Button>

              <span className="">
                {flashcardRecords.length + 1} / {flashcards.length}
              </span>

              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  setFlashcardRecords(
                    produce((prev) => {
                      prev.push({
                        flashcard: flashcardSubset[flashcardRecords.length],
                        correct: true,
                      });
                    }),
                  );
                }}
              >
                <ArrowRight />
              </Button>
            </div>
            <div className="flex justify-end gap-3">
              <Tooltip content="Shuffle">
                <div>
                  <Toggle
                    pressed={shouldShuffle}
                    aria-label="Toggle shuffle"
                    className="h-10 w-10 p-0"
                    onPressedChange={(value) => setShuffle(value)}
                  >
                    <Shuffle />
                  </Toggle>
                </div>
              </Tooltip>
            </div>
          </>
        )}
      </div>

      <Progress
        className="mt-5 h-2"
        value={(flashcardRecords.length / flashcards.length) * 100}
      />
    </div>
  );
}

export default Flashcards;
