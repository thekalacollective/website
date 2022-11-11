import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { formAtom } from ".";
import slugify from "../../../../utils/slugify";
import { trpc } from "../../../../utils/trpc";
import { Inputs } from "./types";
import Image from "next/future/image";

export default function AboutYourPractice() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    mode: "onBlur",
  });
  const getTags = trpc.proxy.constants.getTags.useQuery();
  const getServices = trpc.proxy.constants.getServices.useQuery();
  const validateUsername = trpc.proxy.member.validateMemberUsername.useQuery({
    username: watch("username") ?? "",
  });
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useAtom(formAtom);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setFormData((c) => ({ ...c, ...data }));
    router.push("/member/profile/create?step=3");
  };

  const [profilePicture, setProfilePicture] = useState(
    sessionData?.user?.image
  );

  if (typeof sessionData?.user?.image === "string")
    setValue("profilePicture", sessionData?.user?.image);

  // Handle file upload
  async function handleUploadProfilePicture(e: ChangeEvent<HTMLInputElement>) {
    const extension = e.target.value.split(".").at(-1);
    const res = await fetch(
      `/api/media?fileName=profilePicture&extension=${extension}&userId=${sessionData?.user?.id}`
    );
    if (res.ok) {
      const signedUrl = await res.text();
      if (e.target.files)
        await fetch(signedUrl, {
          method: "PUT",
          body: e.target.files[0],
        })
          .then((res) => {
            if (res.ok) {
              setProfilePicture(
                `https://f004.backblazeb2.com/file/thekalacollective-website-user-media/${sessionData?.user?.id}/profilePicture.png`
              );
              setValue(
                "profilePicture",
                `https://f004.backblazeb2.com/file/thekalacollective-website-user-media/${sessionData?.user?.id}/profilePicture.png`
              );
            }
          })
          .catch((e) => console.log(e));
    } else {
      console.log("An error occured");
      console.log(res);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 divide-y divide-slate-300"
    >
      <div>
        <div>
          <h2 className="text-lg leading-6 font-medium text-slate-900">
            Your profile
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="username"
                autoComplete="username"
                className={clsx(
                  "shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md",
                  errors.username &&
                    "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                )}
                defaultValue={formData.fullName && slugify(formData.fullName)}
                {...register("username", {
                  value: formData.username,
                  required: {
                    value: true,
                    message: "Username is required.",
                  },
                  validate: {
                    unique: () =>
                      validateUsername.data || "Username is already taken.",
                  },
                })}
              />
              {errors.username && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Your profile will be located at{" "}
              <span className="font-bold">
                thekalacollective.com/{watch("username")}
              </span>
            </p>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
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
                {...register("about", {
                  required: true,
                  value: formData.about,
                })}
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
                {!profilePicture ? (
                  <svg
                    className="h-full w-full text-slate-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image src={profilePicture} alt="" fill />
                    <span
                      className="absolute inset-0 shadow-inner rounded-full"
                      aria-hidden="true"
                    />
                  </div>
                )}
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
      <div>
        <h2 className="text-lg leading-6 font-medium text-slate-900 mt-6">
          About your practice
        </h2>
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
                <div className="mt-1 flex rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    id="instagram"
                    placeholder="username"
                    {...register("instagram", {
                      value: formData.instagram,
                    })}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-sky-500 focus:border-sky-500 sm:text-sm border-gray-300"
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
                <div className="mt-1 flex rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    id="website"
                    placeholder="example.com"
                    {...register("website", {
                      value: formData.website,
                    })}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-sky-500 focus:border-sky-500 sm:text-sm border-gray-300"
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
              <div className="mt-1 relative">
                <input
                  type="number"
                  id="yearsOfExperience"
                  className={clsx(
                    "shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md",
                    errors.yearsOfExperience &&
                      "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  )}
                  {...register("yearsOfExperience", {
                    value: formData.yearsOfExperience,
                    valueAsNumber: true,
                    required: {
                      value: true,
                      message: "Years of experience is required",
                    },
                  })}
                />
                {errors.yearsOfExperience && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              {errors.yearsOfExperience && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.yearsOfExperience.message}
                </p>
              )}
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
                        {...register("services", {
                          value: formData.services,
                          validate: {
                            atLeastOne: (value) =>
                              (value && value.length > 0) ||
                              "At least one selection is required",
                          },
                        })}
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
            {errors.services && (
              <p className="mt-2 text-sm text-red-600">
                {errors.services.message}
              </p>
            )}
          </fieldset>
          <fieldset className="mt-6">
            <legend className="text-base font-medium text-slate-900">
              Mention your professional niche(s)
            </legend>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3">
              {getTags.isSuccess &&
                getTags.data.map((tag) => (
                  <div className="relative flex items-start py-1" key={tag.id}>
                    <div className="flex items-center h-5">
                      <input
                        id={tag.id}
                        type="checkbox"
                        value={tag.id}
                        {...register("tags", {
                          value: formData.tags,
                          validate: {
                            atLeastOne: (value) =>
                              (value && value.length > 0) ||
                              "At least one selection is required",
                          },
                        })}
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
            {errors.tags && (
              <p className="mt-2 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </fieldset>
          <fieldset className="mt-6">
            <div>
              <legend className="text-base font-medium text-slate-900">
                Do you travel outside of your base location of work?
              </legend>
            </div>
            {errors.travelPreference && (
              <p className="mt-2 text-sm text-red-600">
                {errors.travelPreference.message}
              </p>
            )}
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <input
                  id="travelPreference-BASE"
                  type="radio"
                  value="BASE"
                  {...register("travelPreference", {
                    value: formData.travelPreference,
                    required: {
                      value: true,
                      message: "Travel preference is required",
                    },
                  })}
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
        </div>{" "}
        <div className="mt-6 flex gap-6">
          <Link href={`?step=1`}>
            <a className="relative flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
              Back
            </a>
          </Link>
          <button
            type="submit"
            className="relative flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
}
