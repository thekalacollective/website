import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const memberRouter = t.router({
  getAllApprovedMembers: t.procedure.query(({ ctx }) => {
    return ctx.prisma.member.findMany({
      where: {
        membershipApplication: {
          status: "APPROVED",
        },
      },
    });
  }),
  getMember: authedProcedure.query(({ ctx }) => {
    return ctx.prisma.member.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        albums: true,
        membershipApplication: true,
        tags: true,
        services: true,
      },
    });
  }),
});
