"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="text-center">
          <h1 className="mt-32 text-3xl font-semibold">
            Something Went Wrong!
          </h1>

          <Button className="mt-8" asChild>
            <Link href={"/"}>Return home</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
