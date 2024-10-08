"use client";
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { AlertCircle, Eye, PlayCircle } from "lucide-react";
import Link from "next/link";
import AdminEvents from "../_components/AdminEvents/AdminEvents";
import UserEvents from "../_components/UserEvents";

export default function Home() {
  const { user, token } = useAuth();

  const renderedContent = () => {
    if (!user || !token) {
      return null;
    } else if (user.role === UserRole.User) {
      return <UserEvents token={token} user={user} />;
    } else if (user.role === UserRole.Admin) {
      return <AdminEvents />;
    }
  };

  return (
    <>
      {user?.role !== UserRole.Admin && (
        <section
          className={cn(
            "w-full flex-center py-[4%]",
            user?.role !== UserRole.User && "h-full"
          )}
        >
          <div className="bg-white dark:bg-gray-900 py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              role="alert"
            >
              <span className="text-xs bg-primary-600 rounded-full text-white bg-black px-4 py-1.5 mr-3">
                New
              </span>
              <span className="text-sm font-medium">
                Discover our latest updates!
              </span>
              <Eye className="ml-2 w-5 h-5" />
            </Link>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Unlock Your Future with Us
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              We focus on innovation, technology, and capital to drive growth
              and create opportunities.
            </p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Link
                href={ROUTES.ABOUT}
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Learn more
                <PlayCircle className="ml-2 -mr-1 w-5 h-5" />
              </Link>
              <Link
                href={"https://www.youtube.com/shorts/-wot7I7Dx-o"}
                target="_blank"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                <AlertCircle className="mr-2 -ml-1 w-5 h-5" />
                Watch video
              </Link>
            </div>
            <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
              <span className="font-semibold text-gray-400 uppercase">
                DEVELOPED BY THE BEST
              </span>
            </div>
          </div>
        </section>
      )}
      {renderedContent()}
    </>
  );
}
