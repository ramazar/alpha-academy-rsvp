import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRsvpResponse, getRsvpResponses } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const attendanceSchema = z.enum(["attending", "not_attending"]);

const ownerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner access is required." });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  rsvp: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().trim().min(2, "Please enter your full name.").max(160),
          phoneNumber: z
            .string()
            .trim()
            .min(7, "Please enter a valid phone number.")
            .max(40)
            .regex(/^[+()\-\s0-9]+$/, "Please enter a valid phone number."),
          attendanceStatus: attendanceSchema,
        }),
      )
      .mutation(async ({ input }) => {
        await createRsvpResponse(input);
        return { success: true } as const;
      }),
    list: ownerProcedure.query(async () => getRsvpResponses()),
  }),
});

export type AppRouter = typeof appRouter;
