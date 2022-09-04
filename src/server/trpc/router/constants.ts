import { t } from "../trpc";

export const constantsRouter = t.router({
  getTags: t.procedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany();
  }),
  getServices: t.procedure.query(({ ctx }) => {
    return ctx.prisma.service.findMany();
  }),
});
