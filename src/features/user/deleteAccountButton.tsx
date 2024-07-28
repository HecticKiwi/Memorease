"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount } from "./server";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

function DeleteAccountButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const confirmDeleteAccount = async () => {
    setIsLoading(true);

    try {
      await deleteAccount();

      router.push("/logout");
    } catch (error) {
      toast({ title: "Something went wrong, please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"}>Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your Memorease account and all
              the data associated with it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={() => confirmDeleteAccount()}
            >
              Delete account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeleteAccountButton;
