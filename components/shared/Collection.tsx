import { IUserEvent } from "@/types";
import Card from "./Card";
import Pagination from "./Pagination";

type CollectionProps = {
  data: IUserEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events";
  onPageChange: (page: number) => void; // Accept page change handler
};

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
  onPageChange, // Destructure onPageChange
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => (
              <li key={event._id} className="flex justify-center">
                <Card
                  userEvent={event}
                  hasOrderLink={collectionType === "Events_Organized"}
                  hidePrice={collectionType === "My_Tickets"}
                />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange} // Pass handler to Pagination
            />
          )}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
