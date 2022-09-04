import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const getApprovedMembersQuery =
    trpc.proxy.member.getAllApprovedMembers.useQuery();
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
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              A safe and comfortable space for artists to network, support,
              collaborate, learn and grow from each other.
            </p>
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
        <ul>
          {getApprovedMembersQuery.data?.map((member) => (
            <li>{member.fullName}</li>
          ))}
        </ul>
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
