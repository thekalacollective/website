import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ApplicationStatus } from "@prisma/client";
import clsx from "clsx";
import { useContext, useState } from "react";
import {
  AdminActionTypes,
  AdminContext,
  AdminDispatchContext,
} from "./adminContext";

export default function AdminHeader() {
  const state = useContext(AdminContext);
  const dispatch = useContext(AdminDispatchContext);

  const [numberOfPendingApplications, setNumberOfPendingApplications] =
    useState(0);
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

  return (
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
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
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
          defaultValue={state.selectedTab}
          onChange={(e) =>
            dispatch({
              type: AdminActionTypes.SET_SELECTED_TAB,
              payload: e.target.value,
            })
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
                  dispatch({
                    type: AdminActionTypes.SET_SELECTED_TAB,
                    payload: tab.name.toUpperCase(),
                  })
                }
                className={clsx(
                  state.selectedTab === tab.name.toUpperCase()
                    ? "border-fuchsia-500 text-fuchsia-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200",
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                )}
              >
                {tab.name}
                {tab.name === "Pending" && numberOfPendingApplications ? (
                  <span
                    className={clsx(
                      state.selectedTab === tab.name.toUpperCase()
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
  );
}
