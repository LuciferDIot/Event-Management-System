"use client";

import { ROUTES } from "@/data";
import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" w-full h-[150px] flex-center bg-black text-white">
      <div
        className="px-[4%] flex-1 w-full h-full max-w-screen-xl flex max-md:flex-col justify-between 
      max-md:justify-center items-center gap-4"
      >
        <div className="flex gap-8">
          <Link href={ROUTES.EVENTS} className="hover:underline">
            Events
          </Link>
          <Link href={ROUTES.USERS} className="hover:underline">
            Users
          </Link>
          <Link href={ROUTES.LOGIN} className="hover:underline">
            Login
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://www.facebook.com"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook className="h-6 w-6 hover:text-blue-500" />
          </Link>
          <Link
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram className="h-6 w-6 hover:text-pink-500" />
          </Link>
          <Link href="https://www.twitter.com" target="_blank" rel="noreferrer">
            <Twitter className="h-6 w-6 hover:text-blue-400" />
          </Link>
          <Link href="https://www.github.com" target="_blank" rel="noreferrer">
            <Github className="h-6 w-6 hover:text-gray-400" />
          </Link>
        </div>
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} Event Sync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
