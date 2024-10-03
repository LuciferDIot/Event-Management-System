"use client";

import { DataTable } from "@/components/data-table/DataTable";
import useFetchUsers from "@/hooks/useFetchUsers";
import { useUserStore } from "@/stores/useUserStore";
import { userColumns } from "./columns";

function Users() {
  const { users } = useUserStore(); // Access users from Zustand store
  const { errorMessage, isMounted } = useFetchUsers(); // Use the custom hook

  // Render nothing if not mounted to avoid hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          <p>{errorMessage}</p>
        </div>
      )}
      <DataTable
        columns={userColumns}
        data={users} // Pass users from Zustand store to the DataTable
        filterPlaceholder={"Search by email..."}
      />
    </div>
  );
}

export default Users;
