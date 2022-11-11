import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

export default function AdminListPagination({
  currentPage,
  setCurrentPage,
  numberOfPages,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  numberOfPages: number;
}) {
  return (
    <nav
      className="border-t border-slate-200 px-4 flex items-center justify-between sm:px-0"
      aria-label="Pagination"
    >
      <div className="-mt-px w-0 flex-1 flex">
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-200"
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
            Previous
          </button>
        )}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {(() => {
          const pages = [];
          for (let i = 0; i < numberOfPages; i++) {
            pages.push(
              <button
                key={"page-button-" + i}
                onClick={() => setCurrentPage(i)}
                className={clsx(
                  "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium",
                  currentPage === i
                    ? "border-fuchsia-500 text-fuchsia-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                )}
              >
                {i + 1}
              </button>
            );
          }
          return pages;
        })()}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        {currentPage < numberOfPages - 1 && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-200"
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </nav>
  );
}
