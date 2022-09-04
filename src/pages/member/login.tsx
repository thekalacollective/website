import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import { SubmitHandler, useForm } from "react-hook-form";
import { ApplicationStatus } from "@prisma/client";

type Inputs = {
  fullName: string;
  username: string;
  dateOfBirth: string;
  state: string;
  city: string;
  email: string;
  phoneNumber: string;
  instagram: string;
  website: string;
  about: string;
  yearsOfExperience: string;
  services: string[];
  tags: string[];
  travelPreference: "BASE" | "REGION" | "COUNTRY";
  survey: any;
};

const MemberLogin: NextPage = (props: {
  status?: ApplicationStatus | undefined;
}) => {
  const { data: sessionData } = useSession();
  const [applicationStatus, setApplicationStatus] = useState<
    ApplicationStatus | undefined
  >(props.status);
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const router = useRouter();

  const getMemberQuery = trpc.proxy.member.getMember.useQuery(undefined, {
    enabled: false,
    onError: () => setPage(1),
    onSuccess: () => setPage(3),
  });
  const createMembershipApplicationMutation =
    trpc.proxy.member.createMembershipApplication.useMutation();

  const getTags = trpc.proxy.constants.getTags.useQuery();
  const getServices = trpc.proxy.constants.getServices.useQuery();
  const getMembershipSurvey = trpc.proxy.survey.getSurvey.useQuery({
    slug: "membershipApplication",
  });

  useEffect(() => {
    if (sessionData && getMemberQuery.isSuccess) {
      let member = getMemberQuery.data;
      let status = member?.membershipApplication?.status;
      if (status === "APPROVED") router.push(`/member/${member?.username}`);
      setApplicationStatus(getMemberQuery.data?.membershipApplication?.status);
    }
  }, [getMemberQuery, sessionData]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.survey.id = getMembershipSurvey.data?.id;
    createMembershipApplicationMutation.mutate(data);
  };

  async function handleUploadProfilePicture(e: ChangeEvent<HTMLInputElement>) {
    const extension = e.target.value.split(".").at(-1);
    const res = await fetch(
      `/api/media?fileName=profilePicture&extension=${extension}&userId=${sessionData?.user?.id}`
    );
    if (res.ok) {
      let signedUrl = await res.text();
      if (e.target.files)
        await fetch(signedUrl, {
          method: "PUT",
          body: e.target.files[0],
        })
          .then((res) => console.log(res))
          .catch((e) => console.log(e));
    } else {
      console.log("An error occured");
      console.log(res);
    }
  }

  return (
    <main className="container flex flex-col p-4 mx-auto text-slate-900">
      {!sessionData ? (
        <div>
          <h1 className="text-lg leading-6 font-medium">Login or Signup</h1>
          <button
            type="button"
            onClick={() =>
              signIn("google").then((res) =>
                res?.ok ? getMemberQuery.refetch() : null
              )
            }
            className="flex w-full items-center justify-center rounded-lg  bg-red-600 py-2 px-4 text-center text-base font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-200 "
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
            </svg>
            Continue with Google
          </button>
        </div>
      ) : applicationStatus === "BLOCKED" ? (
        <h1>Sorry your application could not be approved</h1>
      ) : applicationStatus === "PENDING" ? (
        <h1>Your application is still pending</h1>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h1 className="text-lg leading-6 font-medium">
              Please fill the application form
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
          {createMembershipApplicationMutation.isError && (
            <p>{createMembershipApplicationMutation.error.message}</p>
          )}
          {page === 1 ? (
            <div className="space-y-8 divide-y divide-slate-200">
              <div>
                <div className="pt-8">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-slate-900">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Use a permanent address where you can receive mail.
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="fullName"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("fullName", { required: true })}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-slate-700"
                      >
                        State
                      </label>
                      <div className="mt-1">
                        <select
                          id="state"
                          autoComplete="region"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("state", { required: true })}
                        >
                          <option>Tamil Nadu</option>
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-slate-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <select
                          id="city"
                          autoComplete="city"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("city", { required: true })}
                        >
                          <option>Chennai</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          autoComplete="email"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("email", { required: true })}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="phoneNumber"
                          autoComplete="phone"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("phoneNumber", { required: true })}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Date of Birth
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          id="dateOfBirth"
                          autoComplete="dob"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("dateOfBirth", { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="pt-8">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-slate-900">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Use a permanent address where you can receive mail.
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Username
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="username"
                          autoComplete="username"
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register("username", { required: true })}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-slate-700"
                      >
                        About
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          rows={3}
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border border-slate-300 rounded-md"
                          defaultValue={""}
                          {...register("about", { required: true })}
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Write a few sentences about yourself.
                      </p>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="profilePicture"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Profile Picture
                      </label>
                      <div className="mt-1 flex items-center">
                        <span className="h-12 w-12 rounded-full overflow-hidden bg-slate-100">
                          <svg
                            className="h-full w-full text-slate-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg image/jpg image/png image/webp"
                          name="profilePicture"
                          id="profilePicture"
                          onChange={handleUploadProfilePicture}
                          className="ml-5 bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="pt-8">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-slate-900">
                      About your practice
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Use a permanent address where you can receive mail.
                    </p>
                  </div>
                  <div className="mt-6">
                    <fieldset>
                      <legend className="text-base font-medium text-slate-900">
                        Links
                      </legend>
                      <div className="mt-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="instagram"
                            className="block text-sm font-medium text-slate-700"
                          >
                            Instagram handle
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="instagram"
                              placeholder="@username"
                              {...register("instagram")}
                              className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="instagram"
                            className="block text-sm font-medium text-slate-700"
                          >
                            Website
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="website"
                              placeholder="https://example.com"
                              {...register("website")}
                              className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="yearsOfExperience"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Years of Experience
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="yearsOfExperience"
                            className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:w-auto sm:text-sm border-slate-300 rounded-md"
                            {...register("yearsOfExperience", {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                    <fieldset className="mt-6">
                      <legend className="text-base font-medium text-slate-900">
                        Which services do you offer?
                      </legend>
                      <div className="mt-4 grid md:grid-cols-2">
                        {getServices.isSuccess &&
                          getServices.data.map((service) => (
                            <div
                              className="relative flex items-start py-1"
                              key={service.id}
                            >
                              <div className="flex items-center h-5">
                                <input
                                  id={service.id}
                                  type="checkbox"
                                  value={service.id}
                                  {...register("services")}
                                  className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor={service.id}
                                  className="font-medium text-slate-700"
                                >
                                  {service.name}
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </fieldset>
                    <fieldset className="mt-6">
                      <legend className="text-base font-medium text-slate-900">
                        Mention your professional niche(s)
                      </legend>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3">
                        {getTags.isSuccess &&
                          getTags.data.map((tag) => (
                            <div
                              className="relative flex items-start py-1"
                              key={tag.id}
                            >
                              <div className="flex items-center h-5">
                                <input
                                  id={tag.id}
                                  type="checkbox"
                                  value={tag.id}
                                  {...register("tags")}
                                  className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor={tag.id}
                                  className="font-medium text-slate-700"
                                >
                                  {tag.name}
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </fieldset>
                    <fieldset className="mt-6">
                      <div>
                        <legend className="text-base font-medium text-slate-900">
                          Do you travel outside of your base location of work?
                        </legend>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="travelPreference-BASE"
                            type="radio"
                            value="BASE"
                            {...register("travelPreference")}
                            className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300"
                          />
                          <label
                            htmlFor="travelPreference-BASE"
                            className="ml-3 block text-sm font-medium text-slate-700"
                          >
                            No, I only shoot in my base location.
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="travelPreference-REGION"
                            type="radio"
                            value="REGION"
                            {...register("travelPreference")}
                            className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300"
                          />
                          <label
                            htmlFor="travelPreference-REGION"
                            className="ml-3 block text-sm font-medium text-slate-700"
                          >
                            Yes, I can travel around my city and region.
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="travelPreference-COUNTRY"
                            type="radio"
                            value="COUNTRY"
                            {...register("travelPreference")}
                            className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300"
                          />
                          <label
                            htmlFor="travelPreference-COUNTRY"
                            className="ml-3 block text-sm font-medium text-slate-700"
                          >
                            Yes, I can travel anywhere in the country.
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <button onClick={() => setPage(2)}>Next</button>
            </div>
          ) : page === 2 ? (
            <>
              <div>
                Survey
                {getMembershipSurvey.isSuccess &&
                  (() => {
                    const surveyQuestions = [];
                    for (const [key, value] of Object.entries(
                      getMembershipSurvey.data!.schema!
                    )) {
                      switch (value.type) {
                        case "checkbox":
                          surveyQuestions.push(
                            <fieldset
                              className="mt-6"
                              key={getMembershipSurvey.data!.id! + "-" + key}
                            >
                              <legend className="text-base font-medium text-slate-900">
                                {value.label}
                              </legend>
                              <div className="mt-4 grid md:grid-cols-2">
                                {value.options.map((option: any) => {
                                  return (
                                    <div
                                      key={option.key}
                                      className="relative flex items-start py-1"
                                    >
                                      <div className="flex items-center h-5">
                                        <input
                                          type="checkbox"
                                          id={option.key}
                                          value={option.key}
                                          className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                                          {...register(`survey.answers.${key}`)}
                                        />
                                      </div>
                                      <div className="ml-3 text-sm">
                                        <label
                                          htmlFor={option.key}
                                          className="font-medium text-slate-700"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </fieldset>
                          );
                      }
                    }
                    return surveyQuestions;
                  })()}
              </div>
              <button onClick={() => setPage(1)}>Back</button>
              <button type="submit">Submit</button>
            </>
          ) : page === 3 ? (
            <div>
              Thank you for your interest in joining The Kala Collective! We
              will get back to you shortly
            </div>
          ) : null}
        </form>
      )}
    </main>
  );
};

export default MemberLogin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session && session.user) {
    let member = await prisma?.member.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        membershipApplication: true,
      },
    });
    if (member && member.membershipApplication?.status === "APPROVED") {
      return {
        props: {},
        redirect: {
          destination: `/member/${member.username}`,
          permanent: false,
        },
      };
    } else if (member && member.membershipApplication) {
      return {
        props: {
          status: member.membershipApplication.status,
        },
      };
    }
  }
  return {
    props: {},
  };
};
