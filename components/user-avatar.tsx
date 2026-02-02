"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserAvatarProps = {
  user: User | null;
  onSignOut: () => Promise<void>;
};

export function UserAvatar({ user, onSignOut }: UserAvatarProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.user_metadata.avatar_url ?? undefined} />
            <AvatarFallback>
              {user?.user_metadata.name?.slice(0, 1) ?? user?.email?.slice(0, 1) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={async () => {
            await onSignOut();
            router.replace("/");
          }}
        >
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
