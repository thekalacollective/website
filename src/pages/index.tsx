import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
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
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md overflow-hidden">
              <img
                className="w-full"
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt=""
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
          <p className="mt-4 max-w-3xl mx-auto text-base text-slate-500">
            Lorem ipsum dolor sit amet.
          </p>
        </div>
        <MemberDirectory />
      </section>

      <section className="relative py-8 md:py-16 bg-white">
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
                  <img
                    className="object-cover object-center rounded-3xl shadow-2xl"
                    src="https://images.unsplash.com/photo-1507207611509-ec012433ff52?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80"
                    alt=""
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
                  If you're a female / female-identifying / non-binary
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

import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusSmallIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "All New Arrivals" },
      { value: "tees", label: "Tees" },
      { value: "crewnecks", label: "Crewnecks" },
      { value: "sweatshirts", label: "Sweatshirts" },
      { value: "pants-shorts", label: "Pants & Shorts" },
    ],
  },
  {
    id: "sizes",
    name: "Sizes",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "2xl", label: "2XL" },
    ],
  },
];

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];

function MemberDirectory() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const getApprovedMembersQuery =
    trpc.proxy.member.getAllApprovedMembers.useQuery();
  return (
    <div className="bg-white">
      <div>
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
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`${section.id}-${optionIdx}-mobile`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                                  />
                                  <label
                                    htmlFor={`${section.id}-${optionIdx}-mobile`}
                                    className="ml-3 text-sm text-slate-500"
                                  >
                                    {option.label}
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
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          <aside>
            <h2 className="sr-only">Filters</h2>

            <button
              type="button"
              className="inline-flex items-center lg:hidden"
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
              <form className="divide-y divide-slate-200 space-y-10">
                {filters.map((section, sectionIdx) => (
                  <div
                    key={section.name}
                    className={sectionIdx === 0 ? undefined : "pt-10"}
                  >
                    <fieldset>
                      <legend className="block text-sm font-medium text-slate-900">
                        {section.name}
                      </legend>
                      <div className="pt-6 space-y-3">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              defaultValue={option.value}
                              type="checkbox"
                              className="h-4 w-4 border-slate-300 rounded text-sky-600 focus:ring-sky-500"
                            />
                            <label
                              htmlFor={`${section.id}-${optionIdx}`}
                              className="ml-3 text-sm text-slate-600"
                            >
                              {option.label}
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

          {/* Product grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3">
            <ul className="grid grid-cols-2 gap-4">
              {getApprovedMembersQuery.data?.map((member) => (
                <li
                  key={member.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow col-span-2 md:col-span-1 border border-slate-100"
                >
                  <Link href={`/member/${member.username}`}>
                    <a>
                      <div className="px-4 py-5 sm:p-6 space-y-6">
                        <div className="flex items-center space-x-4">
                          <img
                            className="inline-block h-14 w-14 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <div>
                            <div className="space-x-3">
                              <span>{member.fullName}</span>
                              <span>{member.yearsOfExperience} yrs</span>
                            </div>
                            <div className="text-sm text-slate-500 space-x-3">
                              <span>{`${member?.city}, ${member?.state}`}</span>
                              <span>{member.travelPreference}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="">
                            <dt className="text-sm font-medium text-slate-500">
                              Services
                            </dt>
                            <dd className="text-sm text-slate-900 ">
                              {member?.services?.map((service) => (
                                <span
                                  key={member.id + service.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 mt-2 mr-2"
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
                              {member?.tags?.map((tag) => (
                                <span
                                  key={member.id + tag.id}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 mt-2 mr-2"
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
    </div>
  );
}
