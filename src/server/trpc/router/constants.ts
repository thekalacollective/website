import { z } from "zod";
import { t } from "../trpc";

export const constantsRouter = t.router({
  getTags: t.procedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany();
  }),
  getServices: t.procedure.query(({ ctx }) => {
    return ctx.prisma.service.findMany();
  }),
  getLocationStates: t.procedure.query(({ ctx }) => {
    return ctx.prisma.locationState.findMany();
  }),
  getLocationCities: t.procedure
    .input(
      z.object({
        state: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.locationCity.findMany({
        where: {
          state: {
            id: input.state,
          },
        },
      });
    }),
});
