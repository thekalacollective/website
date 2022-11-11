import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { formAtom } from ".";
import { trpc } from "../../../../utils/trpc";
import { Inputs } from "./types";

export default function PersonalDetails() {
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
}
