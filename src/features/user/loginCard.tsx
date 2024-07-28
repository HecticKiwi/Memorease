import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";

function LoginCard({ className }: { className?: string }) {
  return (
    <>
      <Card className={cn("w-full max-w-md", className)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to Memorease</CardTitle>
          <CardDescription>
            Choose a login provider to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild>
            <Link href="/login/github" className="flex gap-2">
              <FaGithub className="h-5 w-5" />
              <span>Login with GitHub</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login/google" className="flex gap-2">
              <FaGoogle className="h-5 w-5" />
              <span>Login with Google</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default LoginCard;
