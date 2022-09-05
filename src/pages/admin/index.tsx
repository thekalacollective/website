import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import {
  ApplicationStatus,
  Member,
  MembershipApplication,
  Prisma,
  Service,
  SurveyResponse,
  Tag,
} from "@prisma/client";
import clsx from "clsx";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";

const AdminHome: NextPage = (props: {
  pendingApplications?:
    | (Member & {
        membershipApplication:
          | (MembershipApplication & {
              surveyResponse: SurveyResponse;
            })
          | null;
        services: Service[];
        tags: Tag[];
        responses: SurveyResponse[];
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
      : 1
  );
  const [currentPage, setCurrentPage] = useState(props.currentPage ?? 0);
  const [open, setOpen] = useState(false);
  const [numberOfPendingApplications, setNumberOfPendingApplications] =
    useState(props.pendingApplications?.length ?? 0);
  const [selectedApplication, setSelectedApplication] = useState<
    | (Member & {
        membershipApplication:
          | (MembershipApplication & {
              surveyResponse: SurveyResponse;
            })
          | null;
        services: Service[];
        tags: Tag[];
        responses: SurveyResponse[];
      })
    | undefined
  >();
  const tabs = [
    {
      name: "Pending",
    },
    {
      name: "Approved",
    },
    {
      name: "Declined",
    },
    {
      name: "Blocked",
    },
  ];
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
        onSuccess: (data) => {
          setNumberOfPages(Math.ceil(data.length / maxItemsPerPage));
          if (selectedTab === "PENDING") {
            setNumberOfPendingApplications(data.length);
          }
        },
      }
    );

  useEffect(() => {
    getMembersipApplications.refetch();
  }, [open]);

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
            <div className="sm:hidden space-y-8">
              {/* Search section */}
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative text-gray-400 focus-within:text-gray-500">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MagnifyingGlassIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="search"
                    className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 focus:placeholder-gray-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </div>
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm rounded-md"
                defaultValue={selectedTab}
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
                      {tab.name === "Pending" && numberOfPendingApplications ? (
                        <span
                          className={clsx(
                            selectedTab === tab.name.toUpperCase()
                              ? "bg-fuchsia-100 text-fuchsia-600"
                              : "bg-slate-100 text-slate-900",
                            "hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                          )}
                        >
                          {numberOfPendingApplications}
                        </span>
                      ) : null}
                    </button>
                  ))}
                  <div className="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end">
                    {/* Search section */}
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative text-gray-400 focus-within:text-gray-500">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <MagnifyingGlassIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="search"
                          className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 focus:placeholder-gray-500 sm:text-sm"
                          placeholder="Search"
                          type="search"
                          name="search"
                        />
                      </div>
                    </div>
                  </div>
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
                  <button
                    className="group block w-full text-left"
                    onClick={() => {
                      setSelectedApplication(member);
                      setOpen(true);
                    }}
                  >
                    <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                      <div className="min-w-0 flex-1 flex items-center">
                        {member.profilePicture && (
                          <div className="flex-shrink-0 mr-2 sm:mr-4">
                            <img
                              className="h-12 w-12 rounded-full group-hover:opacity-75"
                              src={member.profilePicture}
                              alt=""
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
                  </button>
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
        <SlideOverlay
          open={open}
          setOpen={setOpen}
          memberApplication={selectedApplication}
        />
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
          membershipApplication: {
            include: {
              surveyResponse: true,
            },
          },
          services: true,
          tags: true,
          responses: true,
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

import { Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

function SlideOverlay(props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  memberApplication?:
    | (Member & {
        membershipApplication:
          | (MembershipApplication & {
              surveyResponse: SurveyResponse;
            })
          | null;
        services: Service[];
        tags: Tag[];
        responses: SurveyResponse[];
      })
    | undefined;
}) {
  const { open, setOpen, memberApplication } = props;
  const membershipSurvey = trpc.proxy.survey.getSurvey.useQuery({
    slug: "membershipApplication",
  });
  const approveMember = trpc.proxy.member.approveMember.useMutation();
  if (memberApplication) {
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-screen-xl">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {" "}
                        Profile{" "}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-sky-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Main */}
                  {memberApplication && (
                    <div className="divide-y divide-gray-200">
                      <div className="pb-6">
                        <div className="h-24 bg-sky-900 sm:h-20 lg:h-28" />
                        <div className="lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6">
                          <div>
                            <div className="-m-1 flex">
                              <div className="inline-flex overflow-hidden rounded-full border-4 border-white">
                                {memberApplication?.profilePicture && (
                                  <img
                                    className="h-24 w-24 flex-shrink-0 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
                                    src={memberApplication?.profilePicture}
                                    alt=""
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 sm:ml-6 sm:flex-1">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                  {memberApplication?.fullName}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500">
                                {memberApplication?.username}
                              </p>
                            </div>
                            <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
                              <button
                                onClick={() => {
                                  approveMember.mutate({
                                    memberId: memberApplication?.id,
                                  });
                                  setOpen(false);
                                }}
                                type="button"
                                className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-green-400 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:flex-1"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="inline-flex w-full flex-1 items-center justify-center rounded-md border border-amber-400 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                className="inline-flex w-full flex-1 items-center justify-center rounded-md border border-red-400 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              >
                                Block
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:px-0 sm:py-0">
                        <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              About
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              <p>{memberApplication?.about}</p>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Location
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              {`${memberApplication?.city}, ${memberApplication?.state}`}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              <p>{memberApplication?.email}</p>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Phone
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              <a href="tel:+">
                                {memberApplication?.phoneNumber}
                              </a>
                            </dd>
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="sm:flex sm:px-6 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                                Instagram
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                                {memberApplication?.links &&
                                  typeof memberApplication.links === "object" &&
                                  !Array.isArray(memberApplication.links) &&
                                  typeof memberApplication.links.instagram ==
                                    "string" && (
                                    <>
                                      {memberApplication.links.instagram && (
                                        <a
                                          href={
                                            ("https://instagram.com/" +
                                              memberApplication.links.instagram.slice(
                                                1
                                              )) as string
                                          }
                                          target={"_blank"}
                                        >
                                          {
                                            memberApplication.links
                                              .instagram as string
                                          }
                                        </a>
                                      )}
                                    </>
                                  )}
                              </dd>
                            </div>
                            <div className="sm:flex sm:px-6 sm:py-5">
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                                Website
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                                {memberApplication?.links &&
                                  typeof memberApplication.links === "object" &&
                                  !Array.isArray(memberApplication.links) &&
                                  typeof memberApplication.links.website ==
                                    "string" && (
                                    <>
                                      {memberApplication.links.website && (
                                        <a
                                          href={
                                            memberApplication.links
                                              .website as string
                                          }
                                          target={"_blank"}
                                        >
                                          {
                                            memberApplication.links
                                              .website as string
                                          }
                                        </a>
                                      )}
                                    </>
                                  )}
                              </dd>
                            </div>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Birthday
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              {memberApplication?.dateOfBirth && (
                                <time dateTime="1982-06-23">
                                  {" "}
                                  {new Date(
                                    memberApplication?.dateOfBirth
                                  ).toLocaleDateString("en-IN", {
                                    dateStyle: "long",
                                  })}{" "}
                                </time>
                              )}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Years of Experience
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              {memberApplication?.yearsOfExperience}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48 mt-2">
                              Services
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              <div className="flex space-x-2 flex-wrap">
                                {memberApplication?.services?.map((service) => (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                                    {service.name}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48 mt-2">
                              Niche(s)
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              <div className="flex space-x-2 flex-wrap">
                                {memberApplication?.tags?.map((tag) => (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Travel Preference
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                              {memberApplication?.travelPreference}
                            </dd>
                          </div>
                          {memberApplication?.membershipApplication
                            ?.surveyResponse.answers &&
                            membershipSurvey.data &&
                            typeof membershipSurvey.data.schema === "object" &&
                            !Array.isArray(membershipSurvey.data.schema) &&
                            (() => {
                              let surveyAnswers = [];
                              for (let [key, value] of Object.entries(
                                memberApplication?.membershipApplication
                                  ?.surveyResponse.answers
                              )) {
                                if (
                                  membershipSurvey.data.schema &&
                                  membershipSurvey.data.schema[key] &&
                                  typeof membershipSurvey.data.schema[key] ===
                                    "object" &&
                                  !Array.isArray(
                                    membershipSurvey.data.schema[key]
                                  )
                                ) {
                                  let schema: any =
                                    membershipSurvey!.data!.schema[key]!;
                                  surveyAnswers.push(
                                    <div className="sm:flex sm:px-6 sm:py-5">
                                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                                        {schema[key]["label"]}
                                      </dt>
                                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                                        {(() => {
                                          switch (schema[key].type) {
                                            case "checkbox":
                                              return (
                                                <div className="flex space-x-2 flex-wrap">
                                                  {schema[key].options
                                                    .filter(
                                                      (option: {
                                                        key: string;
                                                        label: string;
                                                      }) =>
                                                        value.includes(
                                                          option.key
                                                        )
                                                    )
                                                    .map(
                                                      (option: {
                                                        key: string;
                                                        label: string;
                                                      }) => (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                                                          {option.label}
                                                        </span>
                                                      )
                                                    )}
                                                </div>
                                              );
                                            default:
                                              return value;
                                          }
                                        })()}
                                      </dd>
                                    </div>
                                  );
                                }
                              }
                              return surveyAnswers;
                            })()}
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
