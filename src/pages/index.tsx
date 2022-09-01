import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const getApprovedMembersQuery =
    trpc.proxy.member.getAllApprovedMembers.useQuery();
  return (
    <main className="container flex flex-col p-4 mx-auto text-slate-900">
      <Head>
        <title>The Kala Collective</title>
        <meta
          name="description"
          content="A growing community of emerging and professional lens-based artists
            in India that identify as female or as non-binary."
        />
      </Head>
      <section className="py-16">
        <hgroup className="prose">
          <h1>The Kala Collective</h1>
          <p>
            A growing community of emerging and professional lens-based artists
            in India that identify as female or as non-binary.
          </p>
          <p>
            This is a safe and comfortable space for artists to network,
            support, collaborate, learn and grow from each other.
          </p>
        </hgroup>
      </section>
      <section className="py-16 prose">
        <h2>Become a Member</h2>
        <p>
          If you're a female / female-identifying / non-binary photographers,
          film-makers, editors and designers residing in India, we invite you to
          join! To become a member of the collective, please fill the membership
          form.
        </p>
        <Link href="/member/login">
          <a className="font-bold hover:underline flex items-center gap-2">
            Apply
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </Link>
      </section>
      <section className="py-16">
        <ul>
          {getApprovedMembersQuery.data?.map((member) => (
            <li>{member.fullName}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
