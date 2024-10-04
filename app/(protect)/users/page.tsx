"use client";

import CreateUserForm from "@/app/_components/CreateUserForm";
import { DataTable } from "@/components/data-table/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useUserStore } from "@/stores/useUserStore";
import { useState } from "react";
import { userColumns } from "./columns";

function Users() {
  const { users } = useUserStore(); // Access users from Zustand store
  const { errorMessage, isMounted } = useFetchUsers();
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );

  // Render nothing if not mounted to avoid hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <Dialog>
      <div className=" container mx-auto py-10">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            <p>{errorMessage}</p>
          </div>
        )}
        <DataTable
          columns={userColumns}
          data={users} // Pass users from Zustand store to the DataTable
          filterPlaceholder={"Search by email..."}
          button={{
            label: "Add user",
            onClick: () => {
              setDialogContent(
                <CreateUserForm setDialogContent={setDialogContent} />
              );
            },
          }}
        />
      </div>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
    </Dialog>
  );
}

export default Users;
