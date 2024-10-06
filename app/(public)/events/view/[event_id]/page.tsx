"use client";

import CategoryBadge from "@/app/_components/CategoryBadge";
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
import useFetchUserEvents from "@/hooks/useFetchUserEvents";
import { cn, formatDateTime, handleError } from "@/lib/utils";
import { Link1Icon } from "@radix-ui/react-icons";
import { CalendarRange, LocateFixedIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Page({ params: { event_id } }: { params: { event_id: string } }) {
  const router = useRouter();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(3);

  const {
    specificUserEvent,
    fetchUserEventById,
    errorMessage,
    categoryUserEvents,
    fetchUserEventsByCategoryId,
    totalPages,
  } = useFetchUserEvents({});

  useEffect(() => {
    const initiate = async () => {
      try {
        await fetchUserEventById(event_id);
        if (specificUserEvent?.event.category._id) {
          await fetchUserEventsByCategoryId(
            specificUserEvent.event.category._id as string,
            currentPage,
            limit
          );
        }
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
  }, [errorMessage, event_id, currentPage, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`${ROUTES.EVENTS}?page=${page}`);
  };

  if (!specificUserEvent) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen py-16">
      <Card className="mx-auto max-w-7xl bg-white shadow-lg p-6 md:p-10">
        <CardHeader className="mb-6">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {specificUserEvent.event.title}
          </CardTitle>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mt-4">
            <Badge
              variant={
                specificUserEvent.event.isFree ? "secondary" : "destructive"
              }
              className={cn(
                `text-xs px-3 py-1 rounded-md font-normal`,
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
            <p className="mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-600">
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
            className="w-full h-full object-cover rounded-md shadow"
          />
          <CardDescription className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                {/* start time  */}
                <div className=" flex flex-col justify-start">
                  <h4>start:</h4>
                  <p className=" text-gray-600 flex-center gap-2">
                    <CalendarRange className="w-4 h-4" />
                    <span>
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
                    </span>
                  </p>
                </div>

                {/* end time  */}
                <div className=" flex flex-col justify-start">
                  <h4>end:</h4>
                  <p className=" text-gray-600 flex-center gap-2">
                    <CalendarRange className="w-4 h-4" />
                    <span>
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
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LocateFixedIcon className="w-4 h-4" />
                <p className=" text-gray-600">
                  {specificUserEvent.event.location}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                What You&apos;ll Gain:
              </h3>
              <p className="text-gray-600 mt-2">
                {specificUserEvent.event.description}
              </p>
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
