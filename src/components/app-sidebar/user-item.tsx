"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { ChevronDown, LogOut, User } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function UserItem() {
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut().then(() => redirect("/"));
  }

  if (isPending || !session) return null;

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {session.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session.user.name}
              </span>
              <div className="flex items-center space-x-1">
                <span className="truncate text-xs">{session.user.email}</span>
              </div>
            </div>
            <ChevronDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              My account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
