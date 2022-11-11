import Link from "next/link";

const steps = [
  { id: "Step 1", name: "Personal details" },
  { id: "Step 2", name: "Application form" },
  { id: "Step 3", name: "Survey" },
];

export default function Steps({ currentStep }: { currentStep: number }) {
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
