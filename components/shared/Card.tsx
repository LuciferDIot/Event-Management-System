import CategoryBadge from "@/app/_components/CategoryBadge";
import { ROUTES } from "@/data";
import { cn, formatDateTime } from "@/lib/utils";
import { IUserEvent } from "@/types";
import Link from "next/link";
import { Badge } from "../ui/badge";

type CardProps = {
  userEvent: IUserEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ userEvent: { event, _id }, hidePrice }: CardProps) => {
  return (
    <div
      className="group relative flex min-h-[380px] w-full 
    max-w-[350px] flex-col overflow-hidden rounded-xl bg-white 
    shadow-md transition-all hover:shadow-lg md:min-h-[438px]"
    >
      <Link
        href={ROUTES.VIEW_EVENT + "/" + _id}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />

      <div className="flex min-h-[150px] flex-col gap-3 p-5 md:gap-4">
        <Link href={ROUTES.VIEW_EVENT + "/" + _id}>
          <h1 className="font-bold line-clamp-2 flex-1 text-black hover:underline transition-none">
            {event.title.toUpperCase()}
          </h1>
        </Link>

        {!hidePrice && (
          <div className="flex gap-2">
            <Badge
              variant={event.isFree ? "secondary" : "destructive"}
              className={cn(
                `text-xs px-3 py-1 rounded-md font-normal`,
                event.isFree
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              )}
            >
              {event.isFree ? "Free" : `$${event.price}`}
            </Badge>
            <CategoryBadge category={event.category} />
          </div>
        )}

        <div className="flex-between w-full text-sm text-grey-500">
          <p>
            Organized by{" "}
            <span className="font-bold">
              {event.organizer.firstName.charAt(0).toUpperCase() +
                event.organizer.firstName.slice(1)}{" "}
              {event.organizer.lastName.charAt(0).toUpperCase() +
                event.organizer.lastName.slice(1)}
            </span>
          </p>

          <p className="flex justify-between text-sm text-grey-500">
            From{" "}
            {formatDateTime(event.startDateTime, event.endDateTime).dateTime} to{" "}
            {formatDateTime(event.endDateTime, event.startDateTime).dateTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
{
}
