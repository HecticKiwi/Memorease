"use server";

import prisma from "@/lib/prisma";
import { FlashcardSetSchema } from "./components/form/flashcardSetForm";
import { Prisma } from "@prisma/client";
import { validateRequest } from "@/lib/auth";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FlashcardSetWithCards = Awaited<ReturnType<typeof getFlashcardSet>>;
export async function getFlashcardSet(id: number) {
  const set = await prisma.flashcardSet.findFirstOrThrow({
    where: { id },
    include: {
      cards: true,
    },
  });

  return set;
}

export type GetFlashcardSetsResponse = Awaited<
  ReturnType<typeof getFlashcardSets>
>;
export const getFlashcardSets = cache(
  async ({
    searchTerm,
    authorId,
    orderBy,
    cursor,
  }: {
    searchTerm?: string;
    authorId?: string;
    orderBy: Prisma.FlashcardSetOrderByWithRelationInput;
    cursor?: any;
  }) => {
    const limit = 15;

    const sets = await prisma.flashcardSet.findMany({
      where: {
        authorId,
        title: searchTerm
          ? {
              contains: searchTerm,
              mode: "insensitive",
            }
          : undefined,
      },
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
        author: true,
      },
      orderBy,
      skip: cursor ? 1 : 0,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      take: limit,
    });

    return {
      sets,
      cursor: sets.length === limit ? sets[limit - 1].id : undefined,
    };
  },
);

export async function upsertFlashcardSet({
  id,
  data,
}: {
  id?: number;
  data: FlashcardSetSchema;
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  if (id) {
    const set = await getFlashcardSet(id);

    if (user.id !== set.authorId) {
      throw new Error("Unauthorized");
    }
  }

  const upsertedSet = await prisma.flashcardSet.upsert({
    where: {
      id: id || 0,
    },
    update: {
      title: data.title,
      description: data.description,
      cards: {
        upsert: data.cards.map((card) => ({
          where: { id: card.id },
          update: card,
          create: card,
        })),
      },
    },
    create: {
      title: data.title,
      description: data.description,
      cards: {
        create: data.cards,
      },
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  revalidatePath("/", "layout");

  return upsertedSet.id;
}

export async function deleteFlashcardSet(flashcardSetId: number) {
  console.log("s");

  const { user } = await validateRequest();

  if (!user) {
    return new Error("Unauthenticated");
  }

  const flashcardSet = await prisma.flashcardSet.findUniqueOrThrow({
    where: {
      id: flashcardSetId,
    },
  });

  if (flashcardSet.authorId !== user.id) {
    return new Error("Unauthorized");
  }

  await prisma.flashcardSet.delete({
    where: {
      id: flashcardSetId,
    },
  });

  revalidatePath("/", "layout");
  redirect("/sets");
}
