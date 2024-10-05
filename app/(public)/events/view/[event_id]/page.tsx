"use client";
import Collection from "@/components/shared/Collection";
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
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useSearchParams
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Page({ params: { event_id } }: { params: { event_id: string } }) {
  const router = useRouter();
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [limit] = useState<number>(3); // Limit of events per page

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
      if (!errorMessage) {
        await fetchUserEventById(event_id);
        if (specificUserEvent?.event.category._id) {
          await fetchUserEventsByCategoryId(
            specificUserEvent.event.category._id as string,
            currentPage,
            limit
          );
        }
      } else {
        toast.error(errorMessage);
        router.push(ROUTES.EVENTS);
      }
    };

    initiate();
  }, [errorMessage, event_id, currentPage, token]); // Re-fetch when page changes

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page
    router.push(`${ROUTES.EVENTS}?page=${page}`); // Update URL with page parameter
  };

  if (!specificUserEvent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full py-[4%]">
      <Card className=" flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <CardHeader className="flex flex-col gap-6">
          <CardTitle className="h2-bold">
            {specificUserEvent.event.title}
          </CardTitle>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                {specificUserEvent.event.isFree
                  ? "FREE"
                  : `$${specificUserEvent.event.price}`}
              </p>
              <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                {specificUserEvent.event.category.name}
              </p>
            </div>

            <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
              by{" "}
              <span className="text-primary-500">
                {specificUserEvent.event.organizer.firstName}{" "}
                {specificUserEvent.event.organizer.lastName}
              </span>
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={specificUserEvent.event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <CardDescription className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
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
                  <p>
                    {
                      formatDateTime(
                        specificUserEvent.event.endDateTime,
                        specificUserEvent.event.startDateTime
                      ).dateOnly
                    }{" "}
                    -{" "}
                    {
                      formatDateTime(
                        specificUserEvent.event.endDateTime,
                        specificUserEvent.event.startDateTime
                      ).timeOnly
                    }
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">
                  {specificUserEvent.event.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">What You&apos;ll Gain:</p>
              <p className="p-medium-16 lg:p-regular-18">
                {specificUserEvent.event.description}
              </p>
              <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                {specificUserEvent.event.url}
              </p>
            </div>
          </CardDescription>
        </CardContent>
      </Card>

      {/* EVENTS with the same category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection
          data={categoryUserEvents}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={limit}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} // Handle page changes
        />
      </section>
    </div>
  );
}

export default Page;
