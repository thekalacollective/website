import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import {
  LocationCity,
  LocationState,
  Member,
  Service,
  Tag,
} from "@prisma/client";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { prisma } from "../../server/db/client";
import slugify from "../../utils/slugify";

type PageProps = {
  member?: Member & {
    location: LocationCity & {
      state: LocationState;
    };
    services: Service[];
    tags: Tag[];
  };
};

const MemberProfile: NextPage = ({ member }: PageProps) => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!member) {
    return <div>Member not found</div>;
  }
  return (
    <main className="py-10 bg-slate-50">
      <div className="container mx-auto px-4 flex mb-6 ">
        <button
          onClick={() => router.back()}
          className="flex text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLongLeftIcon className="mr-3 h-5 w-5" />
          Back
        </button>
      </div>
      {/* Page header */}
      <div className="container mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8">
        <div className="flex items-center space-x-5">
          {member.profilePicture && (
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image src={member.profilePicture} alt="" fill />
              <span
                className="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {member.fullName}
            </h1>
            <p className="text-sm font-medium text-slate-500 capitalize space-x-3">
              <span>
                {`${member.location.name}, ${member.location.state.name}`}
              </span>
            </p>
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
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          {sessionData?.user?.id === member.id && (
            <Link href="/member/profile/edit">
              <a className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-blue-500">
                Edit Profile
              </a>
            </Link>
          )}
        </div>
      </div>

      <div className="container mt-8 mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          {/* Description list*/}
          <section aria-labelledby="member-information-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="member-information-title"
                  className="text-lg leading-6 font-medium text-slate-900"
                >
                  About
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  {member.about}
                </p>
              </div>
              <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
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
                  <div className="sm:col-span-1">
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
                </dl>
              </div>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="connect-title"
          className="lg:col-start-3 lg:col-span-1"
        >
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h2
              id="connect-title"
              className="text-lg font-medium text-slate-900"
            >
              Connect
            </h2>

            {/* Activity Feed */}
            <div className="mt-6 flow-root">
              <ul role="list" className="space-y-4">
                <li className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium">
                  <dt className="text-sm h-6 w-6">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </dt>
                  <dd className="text-sm">
                    {member?.links &&
                      typeof member.links === "object" &&
                      !Array.isArray(member.links) &&
                      typeof member.links.instagram == "string" && (
                        <div>
                          {member.links.instagram && (
                            <a
                              href={
                                ("https://instagram.com/" +
                                  member.links.instagram) as string
                              }
                              target={"_blank"}
                              rel="noreferrer"
                            >
                              {member.links.instagram as string}
                            </a>
                          )}
                        </div>
                      )}
                  </dd>
                </li>
                <li className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium">
                  <dt className="text-sm h-6 w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>

                    <span className="sr-only">Website</span>
                  </dt>
                  <dd className="text-sm">
                    {member?.links &&
                      typeof member.links === "object" &&
                      !Array.isArray(member.links) &&
                      typeof member.links.website == "string" && (
                        <div>
                          {member.links.website && (
                            <a
                              href={
                                ("https://" + member.links.website) as string
                              }
                              target={"_blank"}
                              rel="noreferrer"
                            >
                              {member.links.website as string}
                            </a>
                          )}
                        </div>
                      )}
                  </dd>
                </li>
                <li className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium">
                  <dt className="text-sm h-6 w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span className="sr-only">Website</span>
                  </dt>
                  <dd className="text-sm">
                    <div>
                      {member.phoneNumber && (
                        <a
                          href={("tel:+91" + member.phoneNumber) as string}
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {member.phoneNumber}
                        </a>
                      )}
                    </div>
                  </dd>
                </li>
                <li className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-medium">
                  <dt className="text-sm h-6 w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>

                    <span className="sr-only">Website</span>
                  </dt>
                  <dd className="text-sm">
                    <div>
                      {member.email && (
                        <a
                          href={("mailto:" + member.email) as string}
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {member.email as string}
                        </a>
                      )}
                    </div>
                  </dd>
                </li>
              </ul>
            </div>
            {/* <div className="mt-6 flex flex-col justify-stretch">
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact
              </button>
            </div> */}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MemberProfile;

export const getStaticProps: GetStaticProps = async (context) => {
  let { username } = context.params as { username: string };
  username = slugify(username);

  const member = await prisma.member.findUnique({
    where: {
      username: username,
    },
    include: {
      location: {
        include: {
          state: true,
        },
      },
      services: true,
      tags: true,
    },
  });

  if (!member) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      member: JSON.parse(JSON.stringify(member)),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const members = await prisma.member.findMany({
    select: {
      username: true,
    },
  });

  return {
    paths:
      members?.map((member) => ({ params: { username: member.username } })) ??
      [],
    fallback: "blocking",
  };
};
