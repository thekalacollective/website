// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { memberRouter } from "./member";
import { authRouter } from "./auth";

export const appRouter = t.router({
  member: memberRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
