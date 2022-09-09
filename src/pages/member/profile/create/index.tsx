import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import slugify from "../../../../utils/slugify";
import { trpc } from "../../../../utils/trpc";

const steps = [
  { id: "Step 1", name: "Personal details" },
  { id: "Step 2", name: "Application form" },
  { id: "Step 3", name: "Survey" },
];

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
  survey?: {
    id?: string;
    answers?: {
      [key: string]: string | string[];
    };
  };
};

const formAtom = atom<IFormData>({
  fullName: "",
  username: "",
  dateOfBirth: "",
  state: "",
  city: "",
  email: "",
  phoneNumber: "",
  instagram: "",
  profilePicture: "",
  website: "",
  about: "",
  yearsOfExperience: 0,
  services: [],
  tags: [],
  travelPreference: "BASE",
  survey: {},
});

function Steps({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="py-8">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, idx) => (
          <li key={step.name} className="md:flex-1">
            {idx + 1 < currentStep ? (
              <Link href={`/member/profile/create?step=${idx + 1}`}>
                <a className="group pl-4 py-2 flex flex-col border-l-4 border-fuchsia-600 hover:border-fuchsia-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4">
                  <span className="text-xs text-fuchsia-600 font-semibold tracking-wide uppercase group-hover:text-fuchsia-800">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              </Link>
            ) : idx + 1 === currentStep ? (
              <Link href={`/member/profile/create?step=${idx + 1}`}>
                <a
                  className="pl-4 py-2 flex flex-col border-l-4 border-amber-500 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
                  aria-current="step"
                >
                  <span className="text-xs text-amber-700 font-semibold tracking-wide uppercase">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              </Link>
            ) : (
              <Link href={`/member/profile/create?step=${idx + 1}`}>
                <a className="group pl-4 py-2 flex flex-col border-l-4 border-slate-200 hover:border-slate-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4">
                  <span className="text-xs text-slate-500 font-semibold tracking-wide uppercase group-hover:text-slate-700">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const Step1 = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({});
  const [formData, setFormData] = useAtom(formAtom);
  const { data: sessionData } = useSession();

  const getLocationStates = trpc.proxy.constants.getLocationStates.useQuery();
  const getLocationCities = trpc.proxy.constants.getLocationCities.useQuery({
    state: watch("state") ?? "",
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setFormData((c) => ({ ...c, ...data }));
    router.push("/member/profile/create?step=2");
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>
          <h2 className="text-lg leading-6 font-medium text-slate-900">
            Personal Information
          </h2>
          {/* <p className="mt-1 text-sm text-slate-500">
                      Use a permanent address where you can receive mail.
                    </p> */}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <fieldset className="sm:col-span-4">
            <legend className="text-base font-medium text-slate-900">
              Can you please identify yourself
            </legend>
            <p className="mt-1 text-sm text-slate-500">
              This group is about having female or female-identifying members
              only.
            </p>
            <div className="mt-4 grid md:grid-cols-2">
              <div className="relative flex items-start py-1">
                <div className="flex items-center h-5">
                  <input
                    id="identity-female"
                    type="checkbox"
                    value="female"
                    className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                    {...register("identity", {
                      validate: {
                        atLeastOne: (value) =>
                          (value && value.length > 0) ||
                          "At least one selection is required",
                      },
                    })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="identity-female"
                    className="font-medium text-slate-700"
                  >
                    Female
                  </label>
                </div>
              </div>
              <div className="relative flex items-start py-1" key="">
                <div className="flex items-center h-5">
                  <input
                    id="identity-female-identifying"
                    type="checkbox"
                    value="female-identifying"
                    className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                    {...register("identity", {
                      validate: {
                        atLeastOne: (value) =>
                          (value && value.length > 0) ||
                          "At least one selection is required",
                      },
                    })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="identity-female-identifying"
                    className="font-medium text-slate-700"
                  >
                    Female-Identifying
                  </label>
                </div>
              </div>
            </div>
            {errors.identity && (
              <p className="mt-2 text-sm text-red-600">
                {errors.identity.message}
              </p>
            )}
          </fieldset>
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
                  value: formData.fullName ?? sessionData?.user?.name ?? "",
                  required: { value: true, message: "Full name is required." },
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
                  value: formData.state,
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
                {...register("city", { required: true, value: formData.city })}
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
                  value: formData.email ?? sessionData?.user?.email ?? "",
                  required: { value: true, message: "Email is required." },
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
                  value: formData.phoneNumber,
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
                  value: formData.dateOfBirth,
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
      <button
        type="submit"
        className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
      >
        Next
      </button>
    </form>
  );
};

const Step2 = () => {
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
};

const Step3 = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const [formData, setFormData] = useAtom(formAtom);
  const createMembershipApplicationMutation =
    trpc.proxy.member.createMembershipApplication.useMutation({
      onSuccess: () => router.push("/member/profile/create?success=true"),
      onError: () => router.push("/member/profile/create?error=true"),
    });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setFormData((c) => ({ ...c, ...data }));
    router.push("/member/profile/create?step=3");
    createMembershipApplicationMutation.mutate({ ...formData, ...data });
  };

  const getMembershipSurvey = trpc.proxy.survey.getSurvey.useQuery({
    slug: "membershipApplication",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="text-lg leading-6 font-medium text-slate-900">
          Community Survey
        </h2>
        {getMembershipSurvey.isSuccess &&
          getMembershipSurvey.data &&
          getMembershipSurvey.data.schema &&
          (() => {
            const surveyQuestions = [];
            for (const [key, value] of Object.entries(
              getMembershipSurvey.data.schema
            )) {
              switch (value.type) {
                case "checkbox":
                  surveyQuestions.push(
                    <fieldset
                      className="mt-6"
                      key={getMembershipSurvey.data.id + "-" + key}
                    >
                      <legend className="text-base font-medium text-slate-900">
                        {value.label}
                      </legend>
                      <div className="mt-4 grid md:grid-cols-2">
                        {value.options.map(
                          (option: { key: string; label: string }) => {
                            return (
                              <div
                                key={key + "-" + option.key}
                                className="relative flex items-start py-1"
                              >
                                <div className="flex items-center h-5">
                                  <input
                                    type="checkbox"
                                    id={key + "-" + option.key}
                                    value={option.key}
                                    className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                                    {...register(`survey.answers.${key}`)}
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label
                                    htmlFor={key + "-" + option.key}
                                    className="font-medium text-slate-700"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </fieldset>
                  );
                  break;
                case "textarea":
                  surveyQuestions.push(
                    <div
                      className="mt-6"
                      key={getMembershipSurvey.data.id + "-" + key}
                    >
                      <label
                        htmlFor={key}
                        className="text-base font-medium text-slate-900"
                      >
                        {value.label}
                      </label>
                      <div className="mt-1">
                        <textarea
                          id={key}
                          rows={3}
                          className="shadow-sm focus:ring-sky-500 focus:border-sky-500 mt-1 block w-full sm:text-sm border-slate-300 rounded-md"
                          {...register(`survey.answers.${key}`)}
                        />
                      </div>
                    </div>
                  );
              }
            }
            surveyQuestions.push(
              <input
                key={"id-hidden"}
                type="hidden"
                value={getMembershipSurvey.data.id}
                {...register("survey.id")}
              />
            );
            return surveyQuestions;
          })()}
      </div>
      <div className="mt-6 flex gap-6">
        <Link href={`?step=2`}>
          <a className="relative flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
            Back
          </a>
        </Link>
        <button
          className="relative flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

type IFormData = {
  fullName: string;
  username: string;
  dateOfBirth: string;
  state: string;
  city: string;
  email: string;
  phoneNumber: string;
  instagram: string;
  profilePicture?: string;
  website: string;
  about: string;
  yearsOfExperience: number;
  services: string[];
  tags: string[];
  travelPreference: "BASE" | "REGION" | "COUNTRY";
  survey: any;
};

const Success = () => {
  return (
    <main className="container flex flex-col px-4 py-8 mx-auto text-slate-900">
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        Membership Application
      </h1>

      <Steps currentStep={4} />

      <div className="bg-green-50 p-4 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-green-700">
          Application Submitted!
        </h2>
        <p className="mt-4 text-green-700">
          We will get back to you via the provided email address soon.
        </p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

const Error = () => {
  const createMembershipApplicationMutation =
    trpc.proxy.member.createMembershipApplication.useMutation();
  return (
    <main className="container flex flex-col px-4 py-8 mx-auto text-slate-900">
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        Membership Application
      </h1>

      <Steps currentStep={4} />

      <div className="bg-red-50 p-4 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-red-700">
          Application Unsuccessful
        </h2>
        <p className="mt-4 text-red-700">
          Sorry an error occured. We are looking into this, please try again
          later.
        </p>
        <p>{createMembershipApplicationMutation.error?.message}</p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default function CreateProfile() {
  const router = useRouter();
  const { step, error, success } = router.query;

  if (Boolean(error)) {
    return <Error />;
  }

  if (Boolean(success)) {
    return <Success />;
  }

  if (!step || typeof step != "string" || typeof parseInt(step) != "number") {
    return <div>Page not found</div>;
  }

  const currentStep = parseInt(step);

  return (
    <main className="container flex flex-col px-4 py-8 mx-auto text-slate-900">
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        Membership Application
      </h1>

      <Steps currentStep={currentStep} />

      <div className="bg-slate-50 p-4 rounded-xl">
        {currentStep == 1 && <Step1 />}
        {currentStep == 2 && <Step2 />}
        {currentStep == 3 && <Step3 />}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
