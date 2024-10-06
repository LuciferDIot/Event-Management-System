"use client";

import CreateUserEvents from "@/app/_components/AdminEvents/CreateUserEvents";
import { DataTable } from "@/components/data-table/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useFetchEvents from "@/hooks/useEventActions";
import useFetchUserEvents from "@/hooks/useFetchUserEvents";
import useFetchUsers from "@/hooks/useFetchUsers";
import { IEvent, IUserEvent } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { eventUserColumns } from "./columns";

function EventUsers({
  params: { event_id },
}: {
  params: { event_id: string };
}) {
  const { isMounted: isMountedUsers, nonAdminUsers } = useFetchUsers({
    all: true,
    nonAdmin: true,
  });
  const { errorMessage, isMounted, events } = useFetchEvents();
  const { eventUsers } = useFetchUserEvents({
    eventId: event_id,
  });
  const [usersEvent, setUsersEvent] = useState<IUserEvent[]>(eventUsers);

  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    setUsersEvent(eventUsers);
  }, [eventUsers]);

  // Render nothing if not mounted to avoid hydration error
  if (!isMounted) {
    return null;
  }

  if (!event_id) {
    toast.error("Event not found");
    return null;
  }

  const updateTable = (c: IUserEvent[]) => {
    setUsersEvent(c);
  };

  const handleButtonClick = (event: IEvent) => {
    if (isMountedUsers) {
      setDialogContent(
        <CreateUserEvents
          event={event}
          users={nonAdminUsers}
          updateTable={updateTable}
        />
      );
    } else {
      toast.error("Users not loaded");
    }
  };

  return (
    <Dialog>
      <div className="w-full h-full flex-center flex-col py-10">
        {errorMessage ? (
          <div className="w-full bg-red-100 text-red-700 p-4 mb-4 rounded">
            <p>{errorMessage}</p>
          </div>
        ) : (
          <div className="w-full bg-black bg-opacity-10 text-black-700 p-4 mb-4 rounded">
            <p>Select add user to link or remove users to respective event.</p>
          </div>
        )}
        <DataTable
          columns={eventUserColumns}
          filterColumn="username"
          data={usersEvent}
          filterPlaceholder={"Search by username..."}
          button={{
            label: "Add user",
            onClick: () => {
              const selectedEvent = events.find(
                (event) => event._id === event_id
              );
              if (selectedEvent) {
                handleButtonClick(selectedEvent);
              } else {
                toast.error("Event not found");
              }
            },
          }}
        />
      </div>
      {dialogContent && (
        <DialogContent aria-describedby={"CreateUserEvents"}>
          {dialogContent}
        </DialogContent>
      )}
    </Dialog>
  );
}

export default EventUsers;
