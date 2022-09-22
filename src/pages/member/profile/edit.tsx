import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import Image from "next/future/image";

type Inputs = {
  identity?: string;
  fullName?: string;
  username?: string;
  dateOfBirth?: string;
  state?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  instagram?: string;
  website?: string;
  about?: string;
  yearsOfExperience?: number;
  services?: string[];
  tags?: string[];
  travelPreference?: "BASE" | "REGION" | "COUNTRY";
};

const EditMemberProfile: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({});
  const { data: sessionData } = useSession();
  const getLocationStates = trpc.proxy.constants.getLocationStates.useQuery();
  const getLocationCities = trpc.proxy.constants.getLocationCities.useQuery({
    state: watch("state") ?? "",
  });
  const getTags = trpc.proxy.constants.getTags.useQuery();
  const getServices = trpc.proxy.constants.getServices.useQuery();

  const validateUsername = trpc.proxy.member.validateMemberUsername.useQuery({
    username: watch("username") ?? "",
  });
  const [profilePicture, setProfilePicture] = useState("");

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
  const getMember = trpc.proxy.member.getMember.useQuery(undefined, {
    onSuccess(data) {
      setValue("fullName", data?.fullName ?? "");
      setValue("state", data?.location.stateId ?? "");
      setValue("city", data?.locationCityId ?? "");
      setValue("email", data?.email ?? "");
      setValue("phoneNumber", data?.phoneNumber ?? "");
      setValue("dateOfBirth", data?.dateOfBirth ?? "");
      setValue("username", data?.username ?? "");
      setValue("profilePicture", data?.profilePicture ?? "");
      setProfilePicture(data?.profilePicture ?? "");
      setValue(
        "instagram",
        data?.links &&
          typeof data?.links === "object" &&
          !Array.isArray(data?.links)
          ? data?.links["instagram"] &&
            typeof data?.links["instagram"] === "string"
            ? data?.links["instagram"]
            : ""
          : ""
      );
      setValue(
        "website",
        data?.links &&
          typeof data?.links === "object" &&
          !Array.isArray(data?.links)
          ? data?.links["website"] && typeof data?.links["website"] === "string"
            ? data?.links["website"]
            : ""
          : ""
      );
      setValue("about", data?.about ?? "");
      setValue("yearsOfExperience", data?.yearsOfExperience ?? 0);
      setValue("services", data?.services.map((s) => s.id) ?? []);
      setValue("tags", data?.tags.map((t) => t.id) ?? []);
      setValue("travelPreference", data?.travelPreference ?? "BASE");
    },
    enabled: !!getLocationStates.isSuccess && !!getLocationCities.isSuccess,
  });

  const updateMemberProfile = trpc.proxy.member.updateMember.useMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    updateMemberProfile.mutate(data);
  };

  return (
    <section className="container mx-auto p-4">
      <div className="md:flex md:items-center md:justify-between mt-6 mb-12 border-b">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Profile
          </h1>
        </div>
      </div>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use a permanent address where you can receive mail.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form
              className="shadow overflow-hidden sm:rounded-md"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-8 px-4 py-5 bg-white sm:p-6">
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="fullName"
                        defaultValue={sessionData?.user?.name ?? ""}
                        className={clsx(
                          "shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md",
                          errors.fullName &&
                            "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        )}
                        {...register("fullName", {
                          required: {
                            value: true,
                            message: "Full name is required.",
                          },
                          minLength: {
                            value: 3,
                            message: "Name must be atleast 3 characters long.",
                          },
                        })}
                      />
                      {errors.fullName && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>{" "}
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
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
                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md capitalize"
                        {...register("state", {
                          required: true,
                          onChange: () => {
                            setValue(
                              "city",
                              getLocationCities.data &&
                                getLocationCities.data.length > 0 &&
                                getLocationCities.data[0]
                                ? getLocationCities.data[0].id
                                : ""
                            );
                          },
                        })}
                      >
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
                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md capitalize"
                        {...register("city", {
                          value: getMember.data?.locationCityId,
                          required: true,
                        })}
                      >
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

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="email"
                        id="email"
                        autoComplete="email"
                        defaultValue={sessionData?.user?.email ?? ""}
                        className={clsx(
                          "shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md",
                          errors.email &&
                            "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        )}
                        {...register("email", {
                          required: {
                            value: true,
                            message: "Email is required.",
                          },
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address.",
                          },
                        })}
                      />
                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>{" "}
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-4 relative">
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
                        className={clsx(
                          "shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md",
                          errors.phoneNumber &&
                            "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        )}
                        {...register("phoneNumber", {
                          required: {
                            value: true,
                            message: "Phone number is required.",
                          },
                          pattern: {
                            value: /^[0-9]+$/i,
                            message: "Invalid phone number.",
                          },
                          minLength: {
                            value: 10,
                            message: "Please enter a 10 digit phone number.",
                          },
                          maxLength: {
                            value: 10,
                            message: "Please enter a 10 digit phone number.",
                          },
                        })}
                      />
                      {errors.phoneNumber && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>{" "}
                    {errors.phoneNumber && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Date of Birth
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        id="dateOfBirth"
                        autoComplete="dob"
                        className={clsx(
                          "shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md",
                          errors.dateOfBirth &&
                            "pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        )}
                        {...register("dateOfBirth", {
                          required: {
                            value: true,
                            message: "Date of birth is required.",
                          },
                          min: {
                            value: "1900-01-01",
                            message: "Date of birth is invalid.",
                          },
                          max: {
                            value: "2022-01-01",
                            message: "Date of birth is invalid.",
                          },
                        })}
                      />
                      {errors.dateOfBirth && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>{" "}
                    {errors.dateOfBirth && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Profile
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 shadow overflow-hidden sm:rounded-md bg-white "
            >
              <div className="space-y-8 px-4 py-5 sm:p-6">
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
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Username is required.",
                          },
                          validate: {
                            unique: () =>
                              validateUsername.data ||
                              "Username is already taken.",
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
                        {profilePicture === "" ? (
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

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                About your practice
              </h3>
              <p className="mt-1 text-sm text-gray-600"></p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="space-y-8 px-4 py-5 sm:p-6">
                    <h2 className="text-lg leading-6 font-medium text-slate-900 mt-6"></h2>
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
                              {...register("instagram", {})}
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
                              {...register("website", {})}
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
                            <div
                              className="relative flex items-start py-1"
                              key={tag.id}
                            >
                              <div className="flex items-center h-5">
                                <input
                                  id={tag.id}
                                  type="checkbox"
                                  value={tag.id}
                                  {...register("tags", {
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
                        <p className="mt-2 text-sm text-red-600">
                          {errors.tags.message}
                        </p>
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
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditMemberProfile;
