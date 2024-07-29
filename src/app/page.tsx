import LoginCard from "@/features/user/loginCard";
import { validateRequest } from "@/lib/auth";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/sets");
  }

  return (
    <>
      <div className="flex min-h-[100dvh]">
        <div className="container mx-auto flex flex-col items-center gap-16 px-4 py-12 md:px-6 lg:flex-row lg:px-8">
          <div className="lg:w-2/3">
            <div className="flex items-center gap-8">
              <span className="w-full border-t" />
              <div className="ml-2 flex items-center text-2xl font-medium text-muted-foreground">
                Memorease
              </div>
              <span className="w-full border-t" />
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Boost your learning with flashcards
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Our flashcard app has no frills, just the essentials to maximize
              results.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Check className="text-green-300" />
                  <h3 className="text-lg font-semibold">
                    Simple, yet Powerful
                  </h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Memorease offers an intuitive experience while providing tools
                  that cater to your studying needs.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Check className="text-green-300" />
                  <h3 className="text-lg font-semibold">
                    Import and Export Flashcards
                  </h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Seamlessly import your existing flashcards or export your sets
                  for backup or sharing.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Check className="text-green-300" />
                  <h3 className="text-lg font-semibold">Responsive Design</h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Study anytime, anywhere. Memorease works on all devices, from
                  your desktop to your smartphone.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Check className="text-green-300" />
                  <h3 className="text-lg font-semibold">Ad-free Experience</h3>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Memorease provides a clean, ad-free interface to keep your
                  study sessions uninterrupted.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <LoginCard className="mx-auto" />
          </div>
        </div>
      </div>
    </>
  );
}
