import Image from "next/future/image";
import { useContext } from "react";
import { trpc } from "../../../utils/trpc";
import {
  AdminActionTypes,
  AdminDispatchContext,
  MemberWithFullData,
} from "../adminContext";

export default function MemberDetails({
  member,
}: {
  member: MemberWithFullData;
}) {
  const dispatch = useContext(AdminDispatchContext);
  const membershipSurvey = trpc.proxy.survey.getSurvey.useQuery({
    slug: "membershipApplication",
  });
  const approveMember = trpc.proxy.member.approveMember.useMutation();
  const rejectMember = trpc.proxy.member.declineMember.useMutation();
  const blockMember = trpc.proxy.member.blockMember.useMutation();

  return (
    <div className="divide-y divide-gray-200">
      <div className="pb-6">
        <div className="h-24 bg-sky-900 sm:h-20 lg:h-28" />
        <div className="lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-16 sm:flex sm:items-end sm:px-6">
          <div className="mt-6 sm:ml-6 sm:flex-1">
            <div>
              <div className="flex items-center">
                {member.profilePicture && (
                  <div className="relative inline-flex overflow-hidden rounded-full border-4 border-white h-36 w-36 mr-4">
                    <Image src={member.profilePicture} alt="" fill />
                    <span
                      className="absolute inset-0 shadow-inner rounded-full"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {member?.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{member?.username}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
              <button
                onClick={() => {
                  approveMember.mutate({
                    memberId: member.id,
                  });
                }}
                type="button"
                className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-green-400 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:flex-1"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  rejectMember.mutate({
                    memberId: member.id,
                  });
                }}
                type="button"
                className="inline-flex w-full flex-1 items-center justify-center rounded-md border border-amber-400 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  blockMember.mutate({
                    memberId: member.id,
                  });
                }}
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
              <p>{member?.about}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Location
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6 capitalize">
              {`${member?.location?.name}, ${member?.location?.state.name}`}
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Email
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              <p>{member?.email}</p>
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
              Phone
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              <a href="tel:+">{member?.phoneNumber}</a>
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <div className="sm:flex sm:px-6 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                Instagram
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                {member?.links &&
                  typeof member.links === "object" &&
                  !Array.isArray(member.links) &&
                  typeof member.links.instagram == "string" && (
                    <>
                      {member.links.instagram && (
                        <a
                          href={
                            ("https://instagram.com/" +
                              member.links.instagram.slice(1)) as string
                          }
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {member.links.instagram as string}
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
                {member?.links &&
                  typeof member.links === "object" &&
                  !Array.isArray(member.links) &&
                  typeof member.links.website == "string" && (
                    <>
                      {member.links.website && (
                        <a
                          href={member.links.website as string}
                          target={"_blank"}
                          rel="noreferrer"
                        >
                          {member.links.website as string}
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
              {member?.dateOfBirth && (
                <time dateTime="1982-06-23">
                  {" "}
                  {new Date(member?.dateOfBirth).toLocaleDateString("en-IN", {
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
              {member?.yearsOfExperience}
            </dd>
          </div>
          <div className="sm:flex sm:px-6 sm:py-5">
            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48 mt-2">
              Services
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
              <div className="flex space-x-2 flex-wrap">
                {member?.services?.map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2"
                  >
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
                {member?.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2"
                  >
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
              {member?.travelPreference}
            </dd>
          </div>
          {member?.membershipApplication?.surveyResponse.answers &&
            membershipSurvey.data &&
            typeof membershipSurvey.data.schema === "object" &&
            !Array.isArray(membershipSurvey.data.schema) &&
            (() => {
              const surveyAnswers = [];
              for (const [key, value] of Object.entries(
                member?.membershipApplication?.surveyResponse.answers
              )) {
                const schema = membershipSurvey.data.schema as unknown as {
                  [key: string]:
                    | {
                        type: "checkbox";
                        label: string;
                        options: {
                          label: string;
                          key: string;
                        }[];
                        key: string;
                      }
                    | {
                        type: "textarea";
                        label: string;
                        key: string;
                        hint?: string;
                      };
                };
                if (typeof schema[key] != "undefined") {
                  const field = schema[key];
                  if (field != null && field != undefined) {
                    surveyAnswers.push(
                      <div
                        className="sm:flex sm:px-6 sm:py-5"
                        key={membershipSurvey.data.id + "-" + field.key}
                      >
                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                          {field.label}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 sm:ml-6">
                          {field.type === "checkbox" ? (
                            <div className="flex space-x-2 flex-wrap">
                              {field.options
                                .filter(
                                  (option: { key: string; label: string }) =>
                                    value.includes(option.key)
                                )
                                .map(
                                  (option: { key: string; label: string }) => (
                                    <span
                                      key={
                                        membershipSurvey.data?.id +
                                        "-" +
                                        field?.key +
                                        "-" +
                                        option.key
                                      }
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2"
                                    >
                                      {option.label}
                                    </span>
                                  )
                                )}
                            </div>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    );
                  }
                }
              }
              return surveyAnswers;
            })()}
        </dl>
      </div>
    </div>
  );
}
