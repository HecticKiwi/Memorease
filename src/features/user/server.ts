"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function deleteAccount() {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
}
