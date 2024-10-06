import Collection from "@/components/shared/Collection";
import useUserEventsAction from "@/hooks/useUserEventsAction";
import { IUser } from "@/types";
import { useState } from "react";

type Props = {
  token: string;
  user: IUser;
};

function UserEvents({ user }: Props) {
  const [page, setPage] = useState(1); // State to track current page
  const { userEvents, totalPages } = useUserEventsAction({
    userId: user._id,
    page,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update the page when pagination is triggered
  };

  return (
    <>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
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
