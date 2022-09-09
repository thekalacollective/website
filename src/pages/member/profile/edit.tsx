import { NextPage } from "next";
import { trpc } from "../../../utils/trpc";

const EditMemberProfile: NextPage = () => {
  const member = trpc.proxy.member.getMember.useQuery();
  return <>{member?.data?.fullName}</>;
};

export default EditMemberProfile;
