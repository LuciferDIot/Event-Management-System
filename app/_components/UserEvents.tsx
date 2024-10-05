import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import useFetchUserEvents from "@/hooks/useFetchUserEvents";
import { IUser } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  token: string;
  user: IUser;
};

function UserEvents({ user }: Props) {
  const [page, setPage] = useState(1); // State to track current page
  const { userEvents, totalPages } = useFetchUserEvents({
    userId: user._id,
    page,
  });

  console.log(userEvents);

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update the page when pagination is triggered
  };

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <Collection
          data={userEvents}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={totalPages} // Pass totalPages from hook
          onPageChange={handlePageChange} // Handle pagination
        />
      </section>
    </>
  );
}

export default UserEvents;
