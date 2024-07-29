import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="mt-32 text-3xl font-semibold">Page not Found</h1>

      <Button className="mt-8" asChild>
        <Link href={"/"}>Return home</Link>
      </Button>
    </div>
  );
}
