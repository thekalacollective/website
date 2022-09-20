import { authedProcedure, t } from "../trpc";
import { z } from "zod";

export const createMembershipApplicationSchema = z.object({
  fullName: z.string(),
  username: z.string(),
  dateOfBirth: z.string(),
  state: z.string(),
  city: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string(),
  profilePicture: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  about: z.string(),
  yearsOfExperience: z.number(),
  services: z.union([z.string(), z.array(z.string())]),
  tags: z.union([z.string(), z.array(z.string())]),
  travelPreference: z.enum(["BASE", "REGION", "COUNTRY"]),
  survey: z.object({
    id: z.string(),
    answers: z.any(),
  }),
});

export const memberRouter = t.router({
  getMembers: t.procedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        membershipStatus: z
          .enum(["APPROVED", "PENDING", "DECLINED", "BLOCKED"])
          .optional(),
        search: z.string().optional(),
        // .transform((s) => s?.replace(/[\s\n\t]/g, "_"))
        tags: z
          .array(z.string())
          .optional()
          .transform((s) => (s?.length === 0 ? undefined : s)),
        services: z
          .array(z.string())
          .optional()
          .transform((s) => (s?.length === 0 ? undefined : s)),
        state: z.string().optional(),
        city: z.string().optional(),
        travelPreference: z.array(z.enum(["BASE", "REGION", "COUNTRY"])),
        experienceRange: z
          .object({ start: z.number().optional(), end: z.number().optional() })
          .optional(),
        sortOption: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.member.findMany({
        take: input.limit,
        skip: input.offset,
        include: {
          services: true,
          tags: true,
          location: {
            include: {
              state: true,
            },
          },
        },
        where: {
          membershipApplication: {
            status: input.membershipStatus,
          },
          fullName: {
            contains: input.search,
          },
          location: {
            id: input.city,
            stateId: input.state,
          },
          yearsOfExperience: {
            gte: input.experienceRange?.start,
            lte:
              input.experienceRange?.end === 0
                ? undefined
                : input.experienceRange?.end,
          },
          tags: { some: { id: { in: input.tags } } },
          services: { some: { id: { in: input.services } } },
          travelPreference: {
            in:
              input.travelPreference.length > 0
                ? input.travelPreference
                : undefined,
          },
        },
        orderBy: {
          isFeatured: "desc",
          yearsOfExperience:
            input.sortOption === "experienceDesc"
              ? "desc"
              : input.sortOption === "experienceAsc"
              ? "desc"
              : undefined,
          fullName: input.sortOption === "name" ? "asc" : undefined,
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
        location: {
          include: {
            state: true,
          },
        },
      },
    });
  }),
  createMembershipApplication: authedProcedure
    .input(createMembershipApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.member.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          fullName: input.fullName,
          username: input.username,
          about: input.about,
          location: {
            connect: {
              id: input.city,
            },
          },
          email: input.email,
          dateOfBirth: input.dateOfBirth,
          phoneNumber: input.phoneNumber,
          travelPreference: input.travelPreference,
          yearsOfExperience: input.yearsOfExperience,
          profilePicture: input.profilePicture,
          links: {
            instagram: input.instagram ?? "",
            website: input.website ?? "",
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
          membershipApplication: {
            include: {
              surveyResponse: true,
            },
          },
          services: true,
          tags: true,
          responses: true,
          location: {
            include: {
              state: true,
            },
          },
        },
      });
    }),
  approveMember: authedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role === "ADMIN") {
        return ctx.prisma.membershipApplication.update({
          where: {
            memberId: input.memberId,
          },
          data: {
            status: "APPROVED",
          },
        });
      }
    }),
  declineMember: authedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role === "ADMIN") {
        return ctx.prisma.membershipApplication.update({
          where: {
            memberId: input.memberId,
          },
          data: {
            status: "DECLINED",
          },
        });
      }
    }),
  blockMember: authedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role === "ADMIN") {
        return ctx.prisma.membershipApplication.update({
          where: {
            memberId: input.memberId,
          },
          data: {
            status: "BLOCKED",
          },
        });
      }
    }),
  validateMemberUsername: authedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.findUnique({
        where: {
          username: input.username,
        },
      });
      return member === null;
    }),
});
