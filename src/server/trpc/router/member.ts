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
  createMembershipApplication: authedProcedure
    .input(
      z.object({
        fullName: z.string(),
        username: z.string(),
        dateOfBirth: z.string(),
        state: z.string(),
        city: z.string(),
        email: z.string().email({ message: "Invalid email address" }),
        phoneNumber: z.string(),
        instagram: z.string().startsWith("@"),
        website: z.string().url(),
        about: z.string(),
        yearsOfExperience: z
          .string()
          .refine((val) => Number.isInteger(parseInt(val)))
          .transform((val) => parseInt(val)),
        services: z.union([z.string(), z.array(z.string())]),
        tags: z.union([z.string(), z.array(z.string())]),
        travelPreference: z.enum(["BASE", "REGION", "COUNTRY"]),
        survey: z.object({
          id: z.string(),
          answers: z.any(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.create({
        data: {
          id: ctx.session.user.id,
          fullName: input.fullName,
          username: input.username,
          about: input.about,
          city: input.city,
          state: input.state,
          email: input.email,
          dateOfBirth: input.dateOfBirth,
          phoneNumber: input.phoneNumber,
          travelPreference: input.travelPreference,
          yearsOfExperience: input.yearsOfExperience,
          links: {
            instagram: input.instagram,
            website: input.website,
          },
          isFeatured: false,
          services: {
            connect:
              typeof input.services === "string"
                ? { id: input.services }
                : input.services.map((service) => {
                    return { id: service };
                  }),
          },
          tags: {
            connect:
              typeof input.tags === "string"
                ? { id: input.tags }
                : input.tags.map((tag) => {
                    return { id: tag };
                  }),
          },
          membershipApplication: {
            create: {
              surveyResponse: {
                create: {
                  answers: input.survey.answers,
                  memberId: ctx.session.user.id,
                  surveyId: input.survey.id,
                },
              },
            },
          },
        },
      });
    }),
  getMembershipApplications: authedProcedure
    .input(
      z.object({
        status: z
          .enum(["APPROVED", "PENDING", "DECLINED", "BLOCKED"])
          .optional(),
        limit: z.number(),
        page: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.member.findMany({
        skip: input.page * input.limit,
        take: input.limit,
        where: {
          membershipApplication: {
            status: input.status,
          },
        },
        include: {
          membershipApplication: true,
        },
      });
    }),
});
