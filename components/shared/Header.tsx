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
    <div className="w-full h-[100px] flex justify-evenly items-center">
      <div>
        <Image
          src="/images/logo.svg"
          alt="Event Sync"
          width={120}
          height={24}
        />
      </div>
      <div>
        <ol className="flex gap-6 items-end">
          {user?.role === UserRole.Admin && (
            <NavigationMenuItem route={ROUTES.USERS} title="Users" />
          )}
          <NavigationMenuItem route={ROUTES.EVENTS} title="Events" />
          <li>
            {isLoggedIn ? (
              <Button onClick={logout}>Logout</Button>
            ) : (
              <Button>
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
            )}
          </li>
        </ol>
      </div>
    </div>
  );
}
