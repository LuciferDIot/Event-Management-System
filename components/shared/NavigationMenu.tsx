"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
  route: string;
};

export function NavigationMenuItem({
  title,
  route,
  ...props
}: Props): JSX.Element {
  const pathName = usePathname();
  return (
    <Link href={route}>
      <li {...props} className="group flex items-center py-3 active">
        {/* <span
        className={cn(
          `nav-indicator mr-4 h-px w-8 transition-all group-hover:w-16 
                        group-hover:bg-black group-focus-visible:w-16 
                        motion-reduce:transition-none`,
          pathName === route ? "w-16 bg-black" : "bg-black/50"
        )}
      /> */}
        <span
          className={cn(
            `nav-text text-xs font-bold uppercase tracking-widest 
           group-hover:text-black`,
            pathName === route ? "text-black" : "text-black/50"
          )}
        >
          {title}
        </span>
      </li>
    </Link>
  );
}
