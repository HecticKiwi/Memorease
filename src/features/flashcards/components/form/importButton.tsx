"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { RowSeparator, Separator } from "../exportButton";
import { FlashcardSetSchema } from "./flashcardSetForm";

type FlashcardPreview = {
  question: string;
  answer: string;
};

function parseData(
  text: string,
  lineSeparator: string,
  qaSeparator: string,
): FlashcardPreview[] {
  if (!text) {
    return [];
  }

  // Escape special characters in separators for regex usage
  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create regex patterns for line and QA separators
  const linePattern = new RegExp(lineSeparator, "g");
  const qaPattern = new RegExp(qaSeparator);

  // Split the text into lines
  const lines = text.split(lineSeparator);

  // Map each line to a flashcard object
  const flashcards: FlashcardPreview[] = lines.map((line) => {
    // Split each line into question and answer parts
    const [question, answer] = line.split(qaPattern).map((part) => part.trim());

    // Return the flashcard object
    return { question, answer };
  });

  return flashcards;
}

function ImportButton({
  flashCardsLength,
  append,
}: {
  flashCardsLength: number;
  append: UseFieldArrayAppend<FlashcardSetSchema>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [separator, setSeparator] = useState<Separator>("tab");
  const [customSeparator, setCustomSeparator] = useState(" - ");
  const [rowSeparator, setRowSeparator] = useState<RowSeparator>("newLine");
  const [customRowSeparator, setCustomRowSeparator] = useState("\\n\\n");
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSeparator("tab");
      setCustomRowSeparator(" - ");
      setRowSeparator("newLine");
      setCustomRowSeparator("\\n\\n");
      setText("");
    }
  }, [isOpen]);

  const separatorDictionary = {
    tab: "\t",
    comma: ",",
    custom: customSeparator,
  };

  const rowSeparatorDictionary = {
    newLine: "\n",
    semicolon: ";",
    custom: customRowSeparator.replace(/\\n/g, "\n").replace(/\\t/g, "\t"),
  };

  const lineSeparator = rowSeparatorDictionary[rowSeparator];
  const qaSeparator = separatorDictionary[separator];

  const flashcards = parseData(text, lineSeparator, qaSeparator);

  const importText = () => {
    const newCards: FlashcardSetSchema["cards"] = flashcards.map(
      (flashcard, i) => ({
        id: uuidv4(),
        question: flashcard.question,
        answer: flashcard.answer,
        position: flashCardsLength + i,
      }),
    );

    append(newCards);

    toast({ title: "Data imported successfully." });
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={"secondary"} className="gap-2">
            <Plus className="h-5 w-5" />
            Import
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] max-w-[800px] gap-0 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Copy and paste your date here (from Word, Excel, Quizlet, etc.)
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-2 gap-24">
            <div className="">
              <Label htmlFor="separator">Between term and definition</Label>

              <RadioGroup
                id="separator"
                value={separator}
                onValueChange={(value) => setSeparator(value as Separator)}
                className="mt-2 space-y-2"
              >
                <Label htmlFor="r1" className="flex items-center space-x-2">
                  <RadioGroupItem value="tab" id="r1" />
                  <span>Tab</span>
                </Label>
                <Label htmlFor="r2" className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="r2" />
                  <span>Comma</span>
                </Label>
                <Label htmlFor="r3" className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="r3" />

                  <Input
                    onClick={() => setSeparator("custom")}
                    placeholder="Custom"
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                  />
                </Label>
              </RadioGroup>
            </div>

            <div className="">
              <Label htmlFor="row-separator">Between rows</Label>

              <RadioGroup
                id="row-separator"
                value={rowSeparator}
                onValueChange={(value) =>
                  setRowSeparator(value as RowSeparator)
                }
                className="mt-2 space-y-2"
              >
                <Label
                  htmlFor="newLine"
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value="newLine" id="newLine" />
                  <span>New line</span>
                </Label>
                <Label
                  htmlFor="semicolon"
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value="semicolon" id="semicolon" />
                  <span>Semicolon</span>
                </Label>
                <Label
                  htmlFor="row-separator-custom"
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem value="custom" id="row-separator-custom" />

                  <Input
                    onClick={() => setRowSeparator("custom")}
                    placeholder="Custom"
                    value={customRowSeparator}
                    onChange={(e) => setCustomRowSeparator(e.target.value)}
                  />
                </Label>
              </RadioGroup>
            </div>
          </div>

          <Textarea
            autoFocus
            placeholder={
              "Word 1\tDefinition1\nWord 2\tDefinition2\nWord 3\tDefinition3"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-4"
          />

          <Button
            className="mt-4"
            onClick={() => importText()}
            disabled={flashcards.length === 0}
          >
            Import
          </Button>

          <h3 className="mb-4 mt-6 text-lg font-semibold">Preview</h3>

          <div className="space-y-4">
            {flashcards.map((flashcard, i) => (
              <div key={i} className="rounded-lg border">
                <div className="border-b p-4">
                  <span className="mr-auto text-lg font-semibold">{i}</span>
                </div>

                <div className="grid grid-cols-2 gap-6 p-4">
                  <div className="">
                    <Label htmlFor={`preview-question-${i}`}>Question</Label>
                    <Input
                      id={`preview-question-${i}`}
                      readOnly
                      value={flashcard.question}
                      className="mt-3"
                    />
                  </div>
                  <div className="">
                    <Label htmlFor={`preview-answer-${i}`}>Answer</Label>
                    <Input
                      id={`preview-answer-${i}`}
                      readOnly
                      value={flashcard.answer}
                      className="mt-3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {flashcards.length === 0 && <p>Nothing to preview yet.</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImportButton;
