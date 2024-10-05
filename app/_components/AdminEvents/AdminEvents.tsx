"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Dialog } from "@/components/ui/dialog";
import { ROUTES } from "@/data";
import useFetchEvents from "@/hooks/useEventActions";
import { IEvent } from "@/types";
import { useRouter } from "next/navigation";
import { eventColumns } from "./columns";

function AdminEvents() {
  const router = useRouter();
  const { errorMessage, isMounted, events } = useFetchEvents();

  const handleRowClick = (event: IEvent) => {
    router.push(`${ROUTES.USER_EVENTS}/${event._id}`);
  };

  // Render nothing if not mounted to avoid hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <Dialog>
      <div className="w-full h-full flex-center flex-col py-10">
        {errorMessage ? (
          <div className="w-full bg-red-100 text-red-700 p-4 mb-4 rounded">
            <p>{errorMessage}</p>
          </div>
        ) : (
          <div className="w-full bg-black bg-opacity-10 text-black-700 p-4 mb-4 rounded">
            <p>
              Select each row to display linked users with their respective
              events.
            </p>
          </div>
        )}
        <DataTable
          columns={eventColumns}
          filterColumn="title"
          data={events} // Pass users from Zustand store to the DataTable
          filterPlaceholder={"Search by title..."}
          onRowClick={handleRowClick}
          button={{
            label: "Add event",
            onClick: () => {
              router.push(ROUTES.CREATE_EVENT);
            },
          }}
        />
      </div>
    </Dialog>
  );
}

export default AdminEvents;
