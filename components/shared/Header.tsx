"use client";

import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { NavigationMenuItem } from "./NavigationMenu";

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  return (
    <div className="flex-center sticky top-0 shadow-md backdrop-blur-lg z-30 w-full h-[100px] ">
      <div className="w-full h-full max-w-screen-xl px-[4%] flex justify-between items-center">
        <div>
          <Image
            src="/images/logo.svg"
            alt="Event Sync"
            width={120}
            height={24}
          />
        </div>
        <div>
          <ol className="flex gap-6 items-center">
            {user?.role === UserRole.Admin && (
              <NavigationMenuItem route={ROUTES.USERS} title="Users" />
            )}
            <NavigationMenuItem route={ROUTES.EVENTS} title="Events" />
            <NavigationMenuItem route={ROUTES.ABOUT} title="About us" />
            <li>
              {isLoggedIn ? (
                <Button size={"sm"} onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button size={"sm"}>
                  <Link href={ROUTES.LOGIN}>Login</Link>
                </Button>
              )}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
