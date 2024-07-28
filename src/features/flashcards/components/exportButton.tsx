"use client";

import Tooltip from "@/components/tooltip";
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
import { Flashcard } from "@prisma/client";
import { Download } from "lucide-react";
import { useRef, useState } from "react";

export type Separator = "tab" | "comma" | "custom";
export type RowSeparator = "newLine" | "semicolon" | "custom";

function ExportButton({ flashcards }: { flashcards: Flashcard[] }) {
  const [separator, setSeparator] = useState<Separator>("tab");
  const [customSeparator, setCustomSeparator] = useState(" - ");
  const [rowSeparator, setRowSeparator] = useState<RowSeparator>("newLine");
  const [customRowSeparator, setCustomRowSeparator] = useState("\\n\\n");
  const ref = useRef<HTMLTextAreaElement>(null);

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

  const text = flashcards
    .map(
      (flashcard) =>
        `${flashcard.question}${separatorDictionary[separator]}${flashcard.answer}`,
    )
    .join(rowSeparatorDictionary[rowSeparator]);

  const copyToClipboard = async () => {
    if (!ref.current) {
      return;
    }

    ref.current.select();
    await navigator.clipboard.writeText(ref.current.value);
    toast({ title: "Copied text to clipboard." });
  };

  return (
    <>
      <Dialog>
        <Tooltip content="Export">
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="ml-3">
              <Download className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </Tooltip>

        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              Exported data can be imported into another flashcard set on this
              site or Quizlet.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-24">
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

          <div className="mt-6 flex items-center justify-between">
            <p>Copy and paste the text below. It is read-only.</p>

            <Button onClick={() => copyToClipboard()}>Copy text</Button>
          </div>

          <Textarea
            placeholder="Type your message here."
            rows={10}
            value={text}
            readOnly
            ref={ref}
            onClick={() => ref.current?.select()}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExportButton;
