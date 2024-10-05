"use client";

import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

type PaginationProps = {
  page: number | string; // Current page number
  totalPages: number; // Total number of pages
  urlParamName?: string; // Query parameter name for page
  onPageChange: (page: number) => void; // Function to handle page change
};

const Pagination = ({
  page,
  totalPages,
  urlParamName,
  onPageChange,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    // Call the onPageChange function to update the page state
    onPageChange(pageValue);

    // Build the new URL with the updated page parameter
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    // Navigate to the new URL
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => handleClick("prev")}
        disabled={Number(page) <= 1} // Disable if on the first page
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => handleClick("next")}
        disabled={Number(page) >= totalPages} // Disable if on the last page
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
