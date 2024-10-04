"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Dialog } from "@/components/ui/dialog";
import { ROUTES } from "@/data";
import useFetchEvents from "@/hooks/useEventActions";
import { useRouter } from "next/navigation";
import { eventColumns } from "./columns";

function AdminEvents() {
  const router = useRouter();
  const { errorMessage, isMounted, events } = useFetchEvents();

  // Render nothing if not mounted to avoid hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <Dialog>
      <div className="py-10">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            <p>{errorMessage}</p>
          </div>
        )}
        <DataTable
          columns={eventColumns}
          data={events} // Pass users from Zustand store to the DataTable
          filterPlaceholder={"Search by title..."}
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
