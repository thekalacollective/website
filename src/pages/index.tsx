import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";

import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, PlusSmallIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ApplicationStatus,
  LocationCity,
  LocationState,
  Member,
  Service,
  Tag,
} from "@prisma/client";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/future/image";
import { prisma } from "../server/db/client";

function MemberDirectory({
  members,
  filters,
}: {
  members:
    | (Member & {
        tags: Tag[];
        services: Service[];
        location: LocationCity & {
          state: LocationState;
        };
      })[]
    | undefined;
  filters: {
    name: string;
    id: "tags" | "services";
    options: Tag[] | Service[] | undefined;
  }[];
}) {
  const maxItemsPerPage = 8;
  const numberOfPages = members
    ? Math.ceil(members?.length / maxItemsPerPage)
    : 1;

  const [currentPage, setCurrentPage] = useState(0);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  type Filters = {
    travelPreference: ("BASE" | "REGION" | "COUNTRY")[];
    status: ApplicationStatus;
    tags: string[];
    services: string[];
    experience: {
      start: number | undefined;
      end: number | undefined;
    };
    state: string | undefined;
    city: string | undefined;
  };

  const { register, watch, setValue, getValues } = useForm<Filters>();

  const getLocationStates = trpc.proxy.constants.getLocationStates.useQuery();
  const getLocationCities = trpc.proxy.constants.getLocationCities.useQuery({
    state: watch("state") ?? "",
  });

  const getMembersQuery = trpc.proxy.member.getMembers.useQuery(
    {
      travelPreference: watch("travelPreference")
        ? watch("travelPreference")
        : [],
      membershipStatus: "APPROVED",
      tags: watch("tags") ? watch("tags") : [],
      services: watch("services") ? watch("services") : [],
      experienceRange: {
        start: !watch("experience.start") ? 0 : watch("experience.start"),
        end: !watch("experience.end") ? 0 : watch("experience.end"),
      },
      state: watch("state") === "ANY" ? undefined : watch("state"),
      city: watch("city") === "ANY" ? undefined : watch("city"),
    },
    {
      initialData: members,
      keepPreviousData: true,
    }
  );

  return (
    <div>
      <div className="border-t border-gray-200">
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-slate-900">
                    Filters
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 w-10 h-10 p-2 flex items-center justify-center text-slate-400 hover:text-slate-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  <Disclosure
                    as="div"
                    className="border-t border-slate-200 pt-4 pb-4"
                  >
                    {({ open }) => (
                      <fieldset>
                        <legend className="w-full px-2">
                          <Disclosure.Button className="w-full p-2 flex items-center justify-between text-slate-400 hover:text-slate-500">
                            <span className="text-sm font-medium text-slate-900">
                              Experience
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={clsx(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-5 w-5 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </legend>
                        <Disclosure.Panel className="pt-4 pb-2 px-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="experience-min-mobile"
                                className="block text-sm font-medium text-slate-600"
                              >
                                Minimum
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  id="experience-min-mobile"
                                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                                  onChange={(e) =>
                                    setValue(
                                      "experience.start",
                                      e.target.valueAsNumber
                                    )
                                  }
                                  value={watch("experience.start")}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="experience-max-mobile"
                                className="block text-sm font-medium text-slate-600"
                              >
                                Maximum
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  id="experience-max-mobile"
                                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                                  onChange={(e) =>
                                    setValue(
                                      "experience.end",
                                      e.target.valueAsNumber
                                    )
                                  }
                                  value={watch("experience.end")}
                                />
                              </div>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </fieldset>
                    )}
                  </Disclosure>
                  <Disclosure
                    as="div"
                    className="border-t border-slate-200 pt-4 pb-4"
                  >
                    {({ open }) => (
                      <fieldset>
                        <legend className="w-full px-2">
                          <Disclosure.Button className="w-full p-2 flex items-center justify-between text-slate-400 hover:text-slate-500">
                            <span className="text-sm font-medium text-slate-900">
                              Location
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={clsx(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-5 w-5 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </legend>
                        <Disclosure.Panel className="pt-4 pb-2 px-4 space-y-6">
                          <div className="">
                            <label
                              htmlFor="state-mobile"
                              className="block text-sm font-medium text-slate-500"
                            >
                              State
                            </label>
                            <div className="mt-1">
                              <select
                                id="state-mobile"
                                className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full text-sm text-slate-500 border-slate-300 rounded-md capitalize"
                                defaultValue={"ANY"}
                                onChange={(e) => {
                                  setValue("state", e.target.value);
                                  setValue("city", "ANY");
                                }}
                                value={watch("state")}
                              >
                                <option value={"ANY"} className="capitalize">
                                  Select
                                </option>
                                {getLocationStates.data &&
                                  getLocationStates.data.length > 0 &&
                                  getLocationStates.data.map((state) => (
                                    <option
                                      value={state.id}
                                      key={state.id}
                                      className="capitalize"
                                    >
                                      {state.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="city-mobile"
                              className="block text-sm font-medium text-slate-500"
                            >
                              City
                            </label>
                            <div className="mt-1">
                              <select
                                id="city-mobile"
                                autoComplete="city"
                                className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full text-sm text-slate-500 border-slate-300 rounded-md capitalize"
                                defaultValue={"ANY"}
                                onChange={(e) =>
                                  setValue("city", e.target.value)
                                }
                              >
                                <option value={"ANY"} className="capitalize">
                                  Select
                                </option>
                                {getLocationCities.data &&
                                  getLocationCities.data.length > 0 &&
                                  getLocationCities.data.map((city) => (
                                    <option
                                      value={city.id}
                                      key={city.id}
                                      className="capitalize"
                                    >
                                      {city.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </fieldset>
                    )}
                  </Disclosure>
                  <Disclosure
                    as="div"
                    className="border-t border-slate-200 pt-4 pb-4"
                  >
                    {({ open }) => (
                      <fieldset>
                        <legend className="w-full px-2">
                          <Disclosure.Button className="w-full p-2 flex items-center justify-between text-slate-400 hover:text-slate-500">
                            <span className="text-sm font-medium text-slate-900">
                              Travel Availability
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={clsx(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-5 w-5 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </legend>
                        <Disclosure.Panel className="pt-4 pb-2 px-4">
                          <div className="space-y-6">
                            <div className="flex items-center">
                              <input
                                id="travelPreference-BASE-mobile"
                                type="checkbox"
                                value="BASE"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setValue(
                                      "travelPreference",
                                      getValues("travelPreference")
                                        ? getValues("travelPreference").concat(
                                            "BASE"
                                          )
                                        : ["BASE"]
                                    );
                                  } else {
                                    setValue(
                                      "travelPreference",
                                      getValues("travelPreference")
                                        ? getValues("travelPreference").filter(
                                            (item) => item !== "BASE"
                                          )
                                        : []
                                    );
                                  }
                                }}
                                checked={
                                  getValues("travelPreference")
                                    ? getValues("travelPreference").includes(
                                        "BASE"
                                      )
                                    : false
                                }
                                className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                              />
                              <label
                                htmlFor="travelPreference-BASE-mobile"
                                className="ml-3 block text-sm text-slate-500"
                              >
                                Base location
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="travelPreference-REGION-mobile"
                                type="checkbox"
                                value="REGION"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setValue(
                                      "travelPreference",
                                      getValues("travelPreference")
                                        ? getValues("travelPreference").concat(
                                            "REGION"
                                          )
                                        : ["REGION"]
                                    );
                                  } else {
                                    setValue(
                                      "travelPreference",
                                      getValues("travelPreference")
                                        ? getValues("travelPreference").filter(
                                            (item) => item !== "REGION"
                                          )
                                        : []
                                    );
                                  }
                                }}
                                checked={
                                  getValues("travelPreference")
                                    ? getValues("travelPreference").includes(
                                        "REGION"
                                      )
                                    : false
                                }
                                className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                              />
                              <label
                                htmlFor="travelPreference-REGION-mobile"
                                className="ml-3 block text-sm text-slate-500"
                              >
                                City and region
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="travelPreference-COUNTRY-mobile"
                                type="checkbox"
                                value="COUNTRY"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setValue(
                                      "travelPreference",
                                      getValues("travelPreference")
                                        ? getValues("travelPreference").concat(
                                            "COUNTRY"
                                          )
                                        : ["COUNTRY"]
                                    );
                                  } else {
                                    setValue(
                                      "travelPreference",
                                      getValues("travelPreference")
                                        ? getValues("travelPreference").filter(
                                            (item) => item !== "COUNTRY"
                                          )
                                        : []
                                    );
                                  }
                                }}
                                checked={
                                  getValues("travelPreference")
                                    ? getValues("travelPreference").includes(
                                        "COUNTRY"
                                      )
                                    : false
                                }
                                className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                              />
                              <label
                                htmlFor="travelPreference-COUNTRY-mobile"
                                className="ml-3 block text-sm  text-slate-500"
                              >
                                Anywhere in the country
                              </label>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </fieldset>
                    )}
                  </Disclosure>
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.name}
                      className="border-t border-slate-200 pt-4 pb-4"
                    >
                      {({ open }) => (
                        <fieldset>
                          <legend className="w-full px-2">
                            <Disclosure.Button className="w-full p-2 flex items-center justify-between text-slate-400 hover:text-slate-500">
                              <span className="text-sm font-medium text-slate-900">
                                {section.name}
                              </span>
                              <span className="ml-6 h-7 flex items-center">
                                <ChevronDownIcon
                                  className={clsx(
                                    open ? "-rotate-180" : "rotate-0",
                                    "h-5 w-5 transform"
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </legend>
                          <Disclosure.Panel className="pt-4 pb-2 px-4">
                            <div className="space-y-6">
                              {section.options &&
                                section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.id + "-mobile"}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`${section.id}-${optionIdx}-mobile`}
                                      value={option.id}
                                      type="checkbox"
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setValue(
                                            `${section.id}`,
                                            getValues(`${section.id}`)
                                              ? getValues(
                                                  `${section.id}`
                                                ).concat(option.id)
                                              : [option.id]
                                          );
                                        } else {
                                          setValue(
                                            `${section.id}`,
                                            getValues(`${section.id}`)
                                              ? getValues(
                                                  `${section.id}`
                                                ).filter(
                                                  (item) => item !== option.id
                                                )
                                              : []
                                          );
                                        }
                                      }}
                                      checked={
                                        getValues(`${section.id}`)
                                          ? getValues(`${section.id}`).includes(
                                              option.id
                                            )
                                          : false
                                      }
                                      className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                                    />
                                    <label
                                      htmlFor={`${section.id}-${optionIdx}-mobile`}
                                      className="ml-3 text-sm text-slate-500"
                                    >
                                      {option.name}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </Disclosure.Panel>
                        </fieldset>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
        {/* <div className="flex py-4 justify-start">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="group inline-flex justify-center text-sm font-medium text-slate-700 hover:text-slate-900">
                Sort
                <ChevronDownIcon
                  className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-slate-400 group-hover:text-slate-500"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute left-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <Menu.Item key={option.name}>
                      {({ active }) => (
                        <a
                          href={option.href}
                          className={clsx(
                            option.current
                              ? "font-medium text-slate-900"
                              : "text-slate-500",
                            active ? "bg-slate-100" : "",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          {option.name}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div> */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          <aside>
            <h2 className="sr-only">Filters</h2>

            <button
              type="button"
              className="inline-flex items-center lg:hidden mt-4"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="text-sm font-medium text-slate-700">
                Filters
              </span>
              <PlusSmallIcon
                className="flex-shrink-0 ml-1 h-5 w-5 text-slate-400"
                aria-hidden="true"
              />
            </button>

            <div className="hidden lg:block">
              <form className="divide-y divide-slate-200 space-y-6">
                <fieldset className="mt-6 space-y-4">
                  <div>
                    <legend className="block text-sm font-medium text-slate-900">
                      Experience
                    </legend>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="experience-min"
                        className="block text-sm font-medium text-slate-600"
                      >
                        Minimum
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="experience-min"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("experience.start", {
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="experience-max"
                        className="block text-sm font-medium text-slate-600"
                      >
                        Maximum
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="experience-max"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("experience.end", {
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset className="mt-6 space-y-4">
                  <div className="mt-6">
                    <legend className="block text-sm font-medium text-slate-900">
                      Location
                    </legend>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-slate-600"
                    >
                      State
                    </label>
                    <div className="mt-1">
                      <select
                        id="state"
                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md capitalize"
                        {...register("state", {
                          required: true,
                          onChange: () => {
                            setValue("city", "ANY");
                          },
                        })}
                      >
                        <option value={"ANY"} className="capitalize">
                          Select
                        </option>
                        {getLocationStates.data &&
                          getLocationStates.data.length > 0 &&
                          getLocationStates.data.map((state) => (
                            <option
                              value={state.id}
                              key={state.id}
                              className="capitalize"
                            >
                              {state.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-slate-600"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <select
                        id="city"
                        autoComplete="city"
                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md capitalize"
                        {...register("city", {
                          required: true,
                        })}
                      >
                        <option value={"ANY"} className="capitalize">
                          Select
                        </option>
                        {getLocationCities.data &&
                          getLocationCities.data.length > 0 &&
                          getLocationCities.data.map((city) => (
                            <option
                              value={city.id}
                              key={city.id}
                              className="capitalize"
                            >
                              {city.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </fieldset>
                <fieldset className="mt-6">
                  <div className="mt-6">
                    <legend className="block text-sm font-medium text-slate-900">
                      Travel Availability
                    </legend>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="travelPreference-BASE"
                        type="checkbox"
                        value="BASE"
                        {...register("travelPreference")}
                        className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="travelPreference-BASE"
                        className="ml-3 block text-sm text-slate-600"
                      >
                        Base location
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="travelPreference-REGION"
                        type="checkbox"
                        value="REGION"
                        {...register("travelPreference")}
                        className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="travelPreference-REGION"
                        className="ml-3 block text-sm text-slate-600"
                      >
                        City and region
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="travelPreference-COUNTRY"
                        type="checkbox"
                        value="COUNTRY"
                        {...register("travelPreference")}
                        className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                      />
                      <label
                        htmlFor="travelPreference-COUNTRY"
                        className="ml-3 block text-sm  text-slate-600"
                      >
                        Anywhere in the country
                      </label>
                    </div>
                  </div>
                </fieldset>
                {filters.map((section) => (
                  <div key={section.name} className={"pt-6"}>
                    <fieldset>
                      <legend className="block text-sm font-medium text-slate-900">
                        {section.name}
                      </legend>
                      <div className="pt-6 space-y-3">
                        {section.options &&
                          section.options.map((option, optionIdx) => (
                            <div key={option.id} className="flex items-center">
                              <input
                                id={`${section.id}-${optionIdx}`}
                                value={option.id}
                                type="checkbox"
                                {...register(`${section.id}`)}
                                className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                              />
                              <label
                                htmlFor={`${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-slate-600"
                              >
                                {option.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    </fieldset>
                  </div>
                ))}
              </form>
            </div>
          </aside>

          <div className="pt-6 lg:mt-0 lg:col-span-3 xl:col-span-3">
            <ul className="grid grid-cols-2 gap-4">
              {getMembersQuery.isSuccess &&
                getMembersQuery.data.length > 0 &&
                getMembersQuery.data
                  .slice(
                    maxItemsPerPage * currentPage,
                    getMembersQuery.data.length - 1 <
                      maxItemsPerPage * (currentPage + 1)
                      ? getMembersQuery.data.length
                      : maxItemsPerPage * (currentPage + 1)
                  )
                  .map((member) => (
                    <li
                      key={member.id}
                      className="bg-white overflow-hidden shadow rounded-lg hover:border-slate-300 transition-[border] col-span-2 md:col-span-1 border border-slate-100"
                    >
                      <Link href={`/member/${member.username}`}>
                        <a>
                          <div className="px-4 py-5 sm:p-6 space-y-6">
                            <div className="flex items-center space-x-4 border-b pb-6">
                              {member.profilePicture && (
                                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                                  <Image
                                    src={member.profilePicture}
                                    alt=""
                                    fill
                                    sizes="4rem"
                                  />
                                  <span
                                    className="absolute inset-0 shadow-inner rounded-full"
                                    aria-hidden="true"
                                  />
                                </div>
                              )}
                              <div className="">
                                <div className="flex items-baseline space-x-1">
                                  <span className="align-middle">
                                    {member.fullName}
                                  </span>
                                </div>
                                <div className="text-sm text-slate-500 space-x-1 capitalize flex items-center">
                                  <span className="align-middle">{`${member.location.name}, ${member.location.state.name}`}</span>{" "}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                                {member.yearsOfExperience} Years of Experience
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                {member.travelPreference === "BASE"
                                  ? "City only"
                                  : member.travelPreference === "REGION"
                                  ? "Region"
                                  : "Anyhwere in the country"}
                              </span>
                            </div>
                            <div className="space-y-6">
                              <div className="">
                                <dt className="text-sm font-medium text-slate-500">
                                  Services
                                </dt>
                                <dd className="text-sm text-slate-900 ">
                                  {member.services?.map((service) => (
                                    <span
                                      key={member.id + service.id}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mt-2 mr-2"
                                    >
                                      {service.name}
                                    </span>
                                  ))}
                                </dd>
                              </div>
                              <div className="">
                                <dt className="text-sm font-medium text-slate-500">
                                  Niche
                                </dt>
                                <dd className="text-sm text-slate-900 ">
                                  {member.tags?.map((tag) => (
                                    <span
                                      key={member.id + tag.id}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mt-2 mr-2"
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                </dd>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
      <nav
        className="border-t border-slate-200 px-4 flex items-center justify-between sm:px-0 mt-6"
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
    </div>
  );
}

const Home: NextPage = (props: {
  members?:
    | (Member & {
        tags: Tag[];
        services: Service[];
        location: LocationCity & {
          state: LocationState;
        };
      })[]
    | undefined;
  filters?: {
    name: string;
    id: "tags" | "services";
    options: Tag[] | Service[] | undefined;
  }[];
}) => {
  return (
    <main className="container flex flex-col p-4 mx-auto text-slate-900">
      <section className="py-8 md:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left grid place-content-center">
            <h1>
              <span className="mt-1 block text-3xl tracking-tight font-extrabold sm:text-4xl">
                <span className="block text-slate-900">
                  A community of emerging and professional{" "}
                  <span className="text-pink-600">lens-based artists</span>{" "}
                  identifying as{" "}
                  <span className="text-amber-500">female or non-binary.</span>
                </span>
              </span>
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              A safe and comfortable space for artists to network, support,
              collaborate, learn and grow from each other.
            </p>
            <div className="mt-6 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link href="/about">
                  <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 md:text-lg">
                    About Us
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md overflow-hidden h-full">
              <Image
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt=""
                fill
                sizes="448px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="pb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Members Directory
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base text-slate-500"></p>
        </div>
        {props.members && props.filters && (
          <MemberDirectory members={props.members} filters={props.filters} />
        )}
      </section>

      <section className="relative py-8 md:py-16">
        <div
          className="hidden absolute top-0 inset-x-0 h-1/2 bg-amber-50 lg:block"
          aria-hidden="true"
        />
        <div className="container mx-auto bg-[#8d00b6] overflow-hidden lg:bg-transparent lg:px-8">
          <div className="lg:grid lg:grid-cols-12">
            <div className="relative z-10 lg:col-start-1 lg:row-start-1 lg:col-span-4 lg:py-16 lg:bg-transparent">
              <div
                className="absolute inset-x-0 h-1/2 bg-amber-50 lg:hidden"
                aria-hidden="true"
              />
              <div className="max-w-md mx-auto px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0">
                <div className="aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1">
                  <Image
                    className="object-cover object-center rounded-3xl shadow-2xl"
                    src="https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80"
                    alt=""
                    fill
                    sizes="688px"
                  />
                </div>
              </div>
            </div>

            <div className="relative bg-[#8d00b6] lg:col-start-3 lg:row-start-1 lg:col-span-10 lg:rounded-3xl lg:grid lg:grid-cols-10 lg:items-center">
              <div
                className="hidden absolute inset-0 overflow-hidden rounded-3xl lg:block"
                aria-hidden="true"
              >
                <svg
                  id="visual"
                  viewBox="0 0 1000 600"
                  className="w-full h-full scale-125"
                  width="1000"
                  height="600"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                >
                  <rect
                    x="0"
                    y="0"
                    width="1000"
                    height="600"
                    fill="#8d00b6"
                  ></rect>
                  <defs>
                    <linearGradient
                      id="grad1_0"
                      x1="40%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="16.666666666666664%"
                        stopColor="#ff7e00"
                        stopOpacity="1"
                      ></stop>
                      <stop
                        offset="83.33333333333334%"
                        stopColor="#ff7e00"
                        stopOpacity="1"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient
                      id="grad1_1"
                      x1="40%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="16.666666666666664%"
                        stopColor="#ff7e00"
                        stopOpacity="1"
                      ></stop>
                      <stop
                        offset="83.33333333333334%"
                        stopColor="#8d00b6"
                        stopOpacity="1"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient
                      id="grad2_0"
                      x1="0%"
                      y1="0%"
                      x2="60%"
                      y2="100%"
                    >
                      <stop
                        offset="16.666666666666664%"
                        stopColor="#ff7e00"
                        stopOpacity="1"
                      ></stop>
                      <stop
                        offset="83.33333333333334%"
                        stopColor="#ff7e00"
                        stopOpacity="1"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient
                      id="grad2_1"
                      x1="0%"
                      y1="0%"
                      x2="60%"
                      y2="100%"
                    >
                      <stop
                        offset="16.666666666666664%"
                        stopColor="#8d00b6"
                        stopOpacity="1"
                      ></stop>
                      <stop
                        offset="83.33333333333334%"
                        stopColor="#ff7e00"
                        stopOpacity="1"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <g transform="translate(1000, 0)">
                    <path
                      d="M0 291.5C-17.3 272.4 -34.6 253.2 -57.6 252.5C-80.6 251.8 -109.4 269.5 -126.5 262.7C-143.6 255.9 -149.2 224.6 -167.1 209.5C-185 194.5 -215.3 195.7 -225.9 180.2C-236.6 164.7 -227.7 132.5 -227.9 109.8C-228.2 87 -237.5 73.7 -249.6 57C-261.7 40.2 -276.6 20.1 -291.5 0L0 0Z"
                      fill="#fa0066"
                    ></path>
                    <path
                      d="M0 145.8C-8.7 136.2 -17.3 126.6 -28.8 126.3C-40.3 125.9 -54.7 134.7 -63.2 131.3C-71.8 127.9 -74.6 112.3 -83.5 104.8C-92.5 97.2 -107.6 97.8 -113 90.1C-118.3 82.3 -113.9 66.3 -114 54.9C-114.1 43.5 -118.7 36.8 -124.8 28.5C-130.8 20.1 -138.3 10.1 -145.8 0L0 0Z"
                      fill="#ff7e00"
                    ></path>
                  </g>
                  <g transform="translate(0, 600)">
                    <path
                      d="M0 -291.5C18.2 -271.8 36.4 -252 56.3 -246.7C76.2 -241.4 98 -250.5 119.8 -248.7C141.5 -246.8 163.4 -233.9 169 -211.9C174.5 -189.9 163.8 -158.9 183.7 -146.5C203.7 -134.2 254.3 -140.5 262.7 -126.5C271.1 -112.5 237.2 -78.1 235 -53.6C232.7 -29.2 262.1 -14.6 291.5 0L0 0Z"
                      fill="#fa0066"
                    ></path>
                    <path
                      d="M0 -145.8C9.1 -135.9 18.2 -126 28.1 -123.3C38.1 -120.7 49 -125.3 59.9 -124.3C70.8 -123.4 81.7 -116.9 84.5 -105.9C87.3 -94.9 81.9 -79.4 91.9 -73.3C101.8 -67.1 127.1 -70.3 131.3 -63.2C135.5 -56.2 118.6 -39.1 117.5 -26.8C116.4 -14.6 131.1 -7.3 145.8 0L0 0Z"
                      fill="#ff7e00"
                    ></path>
                  </g>
                </svg>
              </div>
              <div className="relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 lg:col-start-4 lg:col-span-6">
                <h2
                  className="text-3xl font-extrabold text-fuchsia-50"
                  id="join-heading"
                >
                  Become a member
                </h2>
                <p className="text-lg text-fuchsia-100 font-medium">
                  If you&apos;re a female / female-identifying / non-binary
                  photographers, film-makers, editors and designers residing in
                  India, we invite you to join!
                </p>
                <Link href="/member/login">
                  <a className="block py-3 px-5 text-center bg-fuchsia-50 border border-transparent rounded-md shadow-md text-base font-medium text-[#8d00b6] hover:bg-fuchsia-200 sm:inline-block sm:w-auto">
                    Apply
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const members = await prisma.member.findMany({
    where: {
      membershipApplication: {
        status: "APPROVED",
      },
    },
    orderBy: {
      isFeatured: "desc",
    },
    include: {
      services: true,
      tags: true,
      location: {
        include: {
          state: true,
        },
      },
    },
  });

  const tags = await prisma.tag.findMany();
  const services = await prisma.service.findMany();

  return {
    props: {
      members: JSON.parse(JSON.stringify(members)),
      filters: [
        {
          name: "Services",
          id: "services",
          options: services,
        },
        {
          name: "Niche",
          id: "tags",
          options: tags,
        },
      ],
    },
  };
};
