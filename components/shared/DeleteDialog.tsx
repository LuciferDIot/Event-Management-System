"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";

type DeleteProps = {
  task: {
    title: string;
    description: string;
    onClick: () => void;
  };
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function DeleteDialog({
  task,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {task.title ? task.title : "Are you sure absolutely sure ?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {task.description
              ? task.description
              : `This action cannot be undone. You are about to delete Task Details
            of ${task.title}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            size={"sm"}
            variant="destructive"
            onClick={async () => {
              await task.onClick();
              showActionToggle(false);
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
