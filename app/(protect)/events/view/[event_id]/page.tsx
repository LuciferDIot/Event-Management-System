"use client";

import CategoryBadge from "@/app/_components/CategoryBadge";
import ChangeUserEvent from "@/app/_components/ChangeUserEvent";
import Collection from "@/components/shared/Collection";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import useUserEventsAction from "@/hooks/useUserEventsAction";
import { cn, formatDateTime, handleError } from "@/lib/utils";
import { Link1Icon } from "@radix-ui/react-icons";
import { CalendarRange, LocateFixedIcon, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Page({ params: { event_id } }: { params: { event_id: string } }) {
  const router = useRouter();
  const { token, hasHydrated, user } = useAuth(); // Destructure hasHydrated
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(3);

  const {
    specificUserEvent,
    fetchUserEventById,
    errorMessage,
    categoryUserEvents,
    fetchUserEventsByCategoryId,
    totalPages,
  } = useUserEventsAction({
    userId: user?._id,
  });

  useEffect(() => {
    const initiate = async () => {
      if (!hasHydrated || !token) return; // Wait for hydration and token to be available

      try {
        await fetchUserEventById(event_id);
      } catch (error) {
        const errorResponse = handleError(error);
        toast.error(errorResponse.message);
        router.push(ROUTES.EVENTS);
      }
    };

    if (errorMessage) {
      toast.error(errorMessage);
      router.push(ROUTES.EVENTS);
    } else {
      initiate();
    }
  }, [errorMessage, event_id, currentPage, token, hasHydrated]);

  useEffect(() => {
    if (specificUserEvent?.event.category._id) {
      fetchUserEventsByCategoryId(
        specificUserEvent.event.category._id,
        specificUserEvent._id
      );
    }
  }, [specificUserEvent]);

  if (!hasHydrated || !specificUserEvent) {
    return (
      <div className="w-full h-full flex-center text-center mt-12">
        Loading...
      </div>
    ); // Wait until hydrated
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`${ROUTES.EVENTS}?page=${page}`);
  };

  return (
    <div className="w-full min-h-screen py-16">
      <Card className="mx-auto max-w-7xl bg-white shadow-lg p-6 md:p-10">
        <CardHeader className="mb-6 py-0">
          <div className="w-full flex justify-between flex-wrap gap-4">
            <CardTitle className="md:text-3xl text-2xl font-bold text-gray-800">
              {specificUserEvent.event.title}
            </CardTitle>
            <ChangeUserEvent
              userEventId={specificUserEvent._id}
              status={specificUserEvent.status}
              startDate={specificUserEvent.event.startDateTime}
            />
          </div>
          <div className="flex gap-4 items-center flex-wrap mt-2">
            <Badge
              variant={
                specificUserEvent.event.isFree ? "secondary" : "destructive"
              }
              className={cn(
                `text-xs px-3 py-1 rounded-md font-normal w-fit`,
                specificUserEvent.event.isFree
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              )}
            >
              {specificUserEvent.event.isFree
                ? "Free"
                : `$${specificUserEvent.event.price}`}
            </Badge>
            <CategoryBadge category={specificUserEvent.event.category} />
            <p className="text-sm text-gray-600">
              by{" "}
              <span className="text-blue-600 font-medium">
                {specificUserEvent.event.organizer.firstName}{" "}
                {specificUserEvent.event.organizer.lastName}
              </span>
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Image
            src={specificUserEvent.event.imageUrl}
            alt="Event image"
            width={1000}
            height={1000}
            className="w-full h-full max-md:max-h-[350px] max-h-[450px] object-cover rounded-md shadow"
          />
          <CardDescription className="flex flex-col gap-8">
            <div className="grid md:grid-cols-2 max-md:grid-rows-4 gap-4">
              {/* Start time */}
              <div className="flex flex-col">
                <h4>Start:</h4>
                <div className="text-gray-600 flex-center justify-start gap-2">
                  <CalendarRange className="w-4 h-4" />
                  <p>
                    {
                      formatDateTime(
                        specificUserEvent.event.startDateTime,
                        specificUserEvent.event.endDateTime
                      ).dateOnly
                    }{" "}
                    -{" "}
                    {
                      formatDateTime(
                        specificUserEvent.event.startDateTime,
                        specificUserEvent.event.endDateTime
                      ).timeOnly
                    }
                  </p>
                </div>
              </div>

              {/* End time */}
              <div className="flex flex-col">
                <h4>End:</h4>
                <div className="text-gray-600 flex-center justify-start gap-2">
                  <CalendarRange className="w-4 h-4" />
                  <p>
                    {
                      formatDateTime(
                        specificUserEvent.event.startDateTime,
                        specificUserEvent.event.endDateTime
                      ).dateOnly
                    }{" "}
                    -{" "}
                    {
                      formatDateTime(
                        specificUserEvent.event.startDateTime,
                        specificUserEvent.event.endDateTime
                      ).timeOnly
                    }
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col">
                <h4>Location:</h4>
                <div className="text-gray-600 flex-center justify-start gap-2">
                  <LocateFixedIcon className="w-4 h-4" />
                  <p>{specificUserEvent.event.location}</p>
                </div>
              </div>

              {/* Tickets */}
              <div className="flex flex-col">
                <h4>Tickets:</h4>
                <div className="text-gray-600 flex-center justify-start gap-2">
                  <Ticket className="w-4 h-4" />
                  <p>{specificUserEvent.event.slots}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                What You&apos;ll Gain:
              </h3>
              <p
                className="text-gray-600 mt-2 whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: (specificUserEvent.event.description || "").replace(
                    /\n/g,
                    "<br />"
                  ),
                }}
              ></p>
              {specificUserEvent.event.url && (
                <Link
                  href={specificUserEvent.event.url}
                  className="text-blue-600 underline mt-4 block flex-center gap-2"
                >
                  <Link1Icon className="w-4 h-4 mr-2" />
                  {specificUserEvent.event.url}
                </Link>
              )}
            </div>
          </CardDescription>
        </CardContent>
      </Card>

      {/* Related Events */}
      <section className="mt-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Related Events</h2>
        <Collection
          data={categoryUserEvents}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={limit}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  );
}

export default Page;
