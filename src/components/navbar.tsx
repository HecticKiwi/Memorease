import { validateRequest } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Files, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUser } from "react-icons/fa";
import { ModeToggle } from "./themeSwitch";
import Tooltip from "./tooltip";
import { TbCards } from "react-icons/tb";

async function Navbar() {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Not logged in");
  }

  return (
    <div className="flex items-center border-b px-8 py-4">
      <Link
        href={"/sets"}
        className="text-lg font-bold tracking-tight md:text-2xl"
      >
        Memorease
      </Link>

      <Tooltip content="Your sets">
        <Button variant={"outline"} size={"icon"} className="ml-auto" asChild>
          <Link href={"/sets"}>
            <TbCards className="h-5 w-5" />
          </Link>
        </Button>
      </Tooltip>

      <Tooltip content="New set">
        <Button variant={"outline"} size={"icon"} className="ml-4" asChild>
          <Link href={"/sets/create"}>
            <Plus className="h-5 w-5" />
          </Link>
        </Button>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-8 h-10 w-10 rounded-full" variant={"ghost"}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>
                <FaUser />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="max-w-[220px]">
          <div className="px-2 py-1.5">
            <div className="text-sm font-semibold">{user.username}</div>
            <div className="truncate text-xs text-muted-foreground">
              {user.email}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex gap-2" asChild>
            <Link href={"/settings"}>
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex gap-2" asChild>
            <Link href={"/logout"} prefetch={false}>
              <span>Log out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
