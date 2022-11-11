import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { formAtom } from ".";
import { trpc } from "../../../../utils/trpc";
import { Inputs } from "./types";

export default function Survey() {
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
}
