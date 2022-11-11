import { EnvelopeIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { trpc } from "../../utils/trpc";
import {
  AdminActionTypes,
  AdminContext,
  AdminDispatchContext,
} from "./adminContext";
import Image from "next/future/image";
import AdminListPagination from "./AdminListPagination";

export default function AdminList() {
  const state = useContext(AdminContext);
  const dispatch = useContext(AdminDispatchContext);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const MAX_ITEMS_PER_PAGE = 10;

  const getMembersipApplications =
    trpc.proxy.member.getMembershipApplications.useQuery(
      {
        status: state.selectedTab,
        limit: MAX_ITEMS_PER_PAGE,
        page: currentPage,
      },
      {
        keepPreviousData: true,
        onSuccess: (data) => {
          setNumberOfPages(Math.ceil(data.length / MAX_ITEMS_PER_PAGE));
        },
      }
    );

  return (
    <>
      {getMembersipApplications.isSuccess &&
      getMembersipApplications.data.length > 0 ? (
        <ul
          role="list"
          className="mt-5 border-t border-slate-200 divide-y divide-slate-200 sm:mt-0 sm:border-t-0"
        >
          {getMembersipApplications.data.map((member) => {
            if (member.membershipApplication) {
              return (
                <li key={member.email}>
                  <button
                    className="group block w-full text-left"
                    onClick={() => {
                      dispatch({
                        type: AdminActionTypes.SET_SELECTED_MEMBER,
                        payload: member,
                      });
                    }}
                  >
                    <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                      <div className="min-w-0 flex-1 flex items-center">
                        {member.profilePicture && (
                          <div className="relative flex-shrink-0 mr-2 sm:mr-4 h-12 w-12 rounded-full overflow-hidden">
                            <Image
                              className="h-12 w-12 rounded-full group-hover:opacity-75"
                              src={member.profilePicture}
                              alt=""
                              fill
                            />
                            <span
                              className="absolute inset-0 shadow-inner rounded-full"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 grid grid-cols-3 gap-2">
                          <div className="col-span-3 sm:col-span-2">
                            <p className="text-sm font-medium text-fuchsia-600 truncate">
                              {member.fullName}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-slate-500">
                              <EnvelopeIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400"
                                aria-hidden="true"
                              />
                              <span className="truncate">{member.email}</span>
                            </p>
                          </div>
                          <div className="col-span-3 sm:col-span-1 flex justify-between mt-2">
                            <p className="text-sm text-slate-900 font-medium">
                              Applied on{" "}
                              <time
                                className="block text-slate-500"
                                dateTime={new Date(
                                  member.membershipApplication.createdAt
                                ).toLocaleString("en-IN", {
                                  hour12: true,
                                  hour: "numeric",
                                  minute: "numeric",
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })}
                              >
                                {member.membershipApplication.createdAt.toLocaleString(
                                  "en-IN",
                                  {
                                    hour12: true,
                                    hour: "numeric",
                                    minute: "numeric",
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </time>
                            </p>

                            {(() => {
                              switch (member.membershipApplication.status) {
                                case "PENDING":
                                  return (
                                    <p className="mt-2 flex items-center text-sm text-slate-500">
                                      <ExclamationCircleIcon
                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-amber-400"
                                        aria-hidden="true"
                                      />
                                      {member.membershipApplication.status}
                                    </p>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            }

            return null;
          })}
          <AdminListPagination
            numberOfPages={numberOfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </ul>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            No {state.selectedTab.toLowerCase()} applications
          </h2>
        </div>
      )}
    </>
  );
}
