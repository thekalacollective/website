import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import AdminHome from "../../components/admin";

const Admin: NextPage = () => {
  return <AdminHome />;
};

export default Admin;

import { prisma } from "../../server/db/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session && session.user) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    if (user?.role !== "ADMIN") {
      return {
        props: {},
        redirect: { destination: "/member/login", permanent: false },
      };
    }
    return {
      props: {},
    };
  }

  return {
    props: {},
    redirect: { destination: "/admin/login", permanent: false },
  };
};
