import { z } from "zod";
import { t } from "../trpc";

export const surveyRouter = t.router({
  getSurvey: t.procedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.survey.findUnique({
        where: {
          slug: input.slug,
        },
      });
    }),
});
