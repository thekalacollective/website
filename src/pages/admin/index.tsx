import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import {
  ApplicationStatus,
  Member,
  MembershipApplication,
} from "@prisma/client";
import clsx from "clsx";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";

const AdminHome: NextPage = (props: {
  pendingApplications?:
    | (Member & {
        membershipApplication: MembershipApplication | null;
      })[]
    | undefined;
  maxItemsPerPage?: number;
  currentPage?: number;
  selectedTab?: ApplicationStatus;
}) => {
  const [selectedTab, setSelectedTab] = useState<ApplicationStatus>(
    props.selectedTab ?? "PENDING"
  );
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(
    props.maxItemsPerPage ?? 10
  );
  const [numberOfPages, setNumberOfPages] = useState(
    props.pendingApplications
      ? Math.ceil(props.pendingApplications?.length / maxItemsPerPage)
      : 0
  );
  const [currentPage, setCurrentPage] = useState(props.currentPage ?? 0);
  const [tabs, setTabs] = useState([
    {
      name: "Pending",
      current: selectedTab === "PENDING",
    },
    {
      name: "Approved",
      current: selectedTab === "APPROVED",
    },
    {
      name: "Declined",
      current: selectedTab === "DECLINED",
    },
    {
      name: "Blocked",
      current: selectedTab === "BLOCKED",
    },
  ]);
  const getMembersipApplications =
    trpc.proxy.member.getMembershipApplications.useQuery(
      {
        status: selectedTab,
        limit: maxItemsPerPage,
        page: currentPage,
      },
      {
        keepPreviousData: true,
        initialData: props.pendingApplications,
        onSuccess: (data) =>
          setNumberOfPages(Math.ceil(data.length / maxItemsPerPage)),
      }
    );
  return (
    <>
      {/* Page heading */}
      <header className="bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="mt-2 text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
              Membership Applications
            </h1>
          </div>
        </div>
      </header>

      <main className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            {/* Tabs */}
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
                defaultValue={tabs.find((tab) => tab.current)?.name}
                onChange={(e) =>
                  setSelectedTab(e.target.value as ApplicationStatus)
                }
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-slate-200">
                <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() =>
                        setSelectedTab(
                          tab.name.toUpperCase() as ApplicationStatus
                        )
                      }
                      className={clsx(
                        selectedTab === tab.name.toUpperCase()
                          ? "border-fuchsia-500 text-fuchsia-600"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200",
                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                      )}
                    >
                      {tab.name}
                      {tab.name === "Pending" ? (
                        <span
                          className={clsx(
                            selectedTab === tab.name.toUpperCase()
                              ? "bg-fuchsia-100 text-fuchsia-600"
                              : "bg-slate-100 text-slate-900",
                            "hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                          )}
                        >
                          1
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Stacked list */}
          <ul
            role="list"
            className="mt-5 border-t border-slate-200 divide-y divide-slate-200 sm:mt-0 sm:border-t-0"
          >
            {getMembersipApplications.isSuccess &&
            getMembersipApplications.data.length > 0 ? (
              getMembersipApplications.data.map((member) => (
                <li key={member.email}>
                  <a href="#" className="group block">
                    <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          {/* <img
                            className="h-12 w-12 rounded-full group-hover:opacity-75"
                            src={member.profilePicture}
                            alt=""
                          /> */}
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
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
                          <div className="hidden md:block">
                            <div>
                              <p className="text-sm text-slate-900">
                                Applied on{" "}
                                <time
                                  dateTime={new Date(
                                    member.membershipApplication!.createdAt
                                  ).toLocaleString("en-IN", {
                                    hour12: true,
                                    hour: "numeric",
                                    minute: "numeric",
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}
                                >
                                  {member.membershipApplication!.createdAt.toLocaleString(
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
                                switch (member.membershipApplication?.status) {
                                  case "PENDING":
                                    return (
                                      <p className="mt-2 flex items-center text-sm text-slate-500">
                                        <ExclamationCircleIcon
                                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-amber-400"
                                          aria-hidden="true"
                                        />
                                        {member.membershipApplication?.status}
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
                    </div>
                  </a>
                </li>
              ))
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
                  No {selectedTab.toLowerCase()} applications
                </h2>
              </div>
            )}
          </ul>

          {/* Pagination */}
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
                let pages = [];
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
        </div>
      </main>
    </>
  );
};

export default AdminHome;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session && session.user) {
    if (session.user.role === "ADMIN") {
      const maxItemsPerPage = 10;
      const currentPage = 0;
      const selectedTab = "PENDING";
      const pendingApplications = await prisma?.member.findMany({
        skip: currentPage * maxItemsPerPage,
        take: maxItemsPerPage,
        where: {
          membershipApplication: {
            status: selectedTab,
          },
        },
        include: {
          membershipApplication: true,
        },
      });
      return {
        props: {
          maxItemsPerPage,
          currentPage,
          selectedTab,
          pendingApplications: JSON.parse(JSON.stringify(pendingApplications)), // Reason: https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret
        },
      };
    } else if (session.user.role === "MEMBER") {
      return {
        props: {},
        redirect: { destination: "/member/login", permanent: false },
      };
    }
  }

  return {
    props: {},
    redirect: { destination: "/admin/login", permanent: false },
  };
};
