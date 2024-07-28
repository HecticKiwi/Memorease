import Tooltip from "@/components/tooltip";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

import DeleteSetButton from "@/features/flashcards/components/deleteSetButton";
import ExportButton from "@/features/flashcards/components/exportButton";
import Flashcards from "@/features/flashcards/components/flashcards";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Edit2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

async function EditPage({ params: { id } }: { params: { id: string } }) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }

  const flashcardSet = await prisma.flashcardSet.findUniqueOrThrow({
    where: {
      id: Number(id),
    },
    include: {
      cards: true,
      author: true,
    },
  });

  return (
    <div className="p-4 py-8 md:p-8">
      <div className="mx-auto max-w-screen-md">
        <h1 className="text-3xl font-bold tracking-tight">
          {flashcardSet.title}
        </h1>

        <Flashcards className="mt-6" flashcards={flashcardSet.cards} />

        <div className="mt-12 flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="text-lg font-semibold">
              {flashcardSet.author.username}
            </div>
            <div className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(flashcardSet.createdAt)} ago
            </div>
          </div>

          {user?.id === flashcardSet.authorId && (
            <>
              <Tooltip content="Edit">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="ml-auto"
                  asChild
                >
                  <Link href={`/sets/${flashcardSet.id}/edit`}>
                    <Edit2 className="h-5 w-5" />
                  </Link>
                </Button>
              </Tooltip>

              <DeleteSetButton flashcardSetId={Number(id)} />
            </>
          )}

          <ExportButton flashcards={flashcardSet.cards} />
        </div>

        {flashcardSet.description && (
          <p className="mt-4">{flashcardSet.description}</p>
        )}

        <div className="my-12 h-[1px] bg-border"></div>

        <h2 className="mb-4 text-lg font-semibold">
          Terms in this set ({flashcardSet.cards.length})
        </h2>

        <div className="space-y-4">
          {flashcardSet.cards.map((card) => (
            <div key={card.id} className="flex rounded-lg border p-8">
              <div className="mr-12 w-1/3 border-r">{card.question}</div>
              <div className="w-2/3">{card.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditPage;
