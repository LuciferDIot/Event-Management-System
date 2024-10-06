"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserEventsAction from "@/hooks/useUserEventsAction";
import { handleError } from "@/lib/utils";
import { UserEventStatus } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  userEventId: string;
  status?: UserEventStatus;
  startDate: Date;
};

function ChangeUserEvent({ userEventId, status, startDate }: Props) {
  const { updateUserEventStatusAction, errorMessage } = useUserEventsAction({});
  const [currentStatus, setCurrentStatus] = useState<
    UserEventStatus | undefined
  >(status);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  // Check if the event is overdue based on the start date
  useEffect(() => {
    const now = new Date();
    if (startDate < now) {
      setCurrentStatus(UserEventStatus.Overdue);
      setIsOverdue(true);
      toast.info(
        "Event is overdue and status is automatically set to Overdue."
      );
    }
  }, [startDate]);

  // Handle the status change
  const handleStatusChange = async (newStatus: UserEventStatus) => {
    if (isOverdue) {
      // Prevent changing the status if the event is overdue
      toast.warning("You cannot change the status of an overdue event.");
      return;
    }

    try {
      await updateUserEventStatusAction(userEventId, newStatus);
      if (!errorMessage) {
        setCurrentStatus(newStatus); // Update the local state
        toast.success("Status updated successfully");
      }
    } catch (error) {
      const errorRecreate = await handleError(error);
      toast.error(errorRecreate.message);
    }
  };

  // Display error message if needed
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => handleStatusChange(value as UserEventStatus)}
      disabled={isOverdue} // Disable the select if the event is overdue
    >
      <SelectTrigger className="md:w-[180px] w-full">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {Object.values(UserEventStatus).map(
            (status) =>
              status !== UserEventStatus.Overdue && (
                <SelectItem value={status} key={status}>
                  {status}
                </SelectItem>
              )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ChangeUserEvent;
