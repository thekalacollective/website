import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

const AdminLogin: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData && sessionData.user) {
      if (sessionData.user.role === "ADMIN") {
        router.push("/admin");
      }
    }
  }, [sessionData]);

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title key="meta-title">Admin Login | The Kala Collective</title>
      </Head>
      <h1>Login or Signup</h1>
      <button
        type="button"
        onClick={() => signIn("google")}
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
  );
};

export default AdminLogin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session && session.user) {
    if (session.user.role === "ADMIN") {
      return {
        props: {},
        redirect: { destination: "/admin", permanent: false },
      };
    } else if (session.user.role === "MEMBER") {
      return {
        props: {},
        redirect: { destination: "/member/login", permanent: false },
      };
    }
  }
  return {
    props: {},
  };
};
