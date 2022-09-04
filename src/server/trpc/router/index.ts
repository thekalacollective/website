// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { memberRouter } from "./member";
import { authRouter } from "./auth";
import { constantsRouter } from "./constants";
import { surveyRouter } from "./survey";

export const appRouter = t.router({
  member: memberRouter,
  auth: authRouter,
  constants: constantsRouter,
  survey: surveyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
