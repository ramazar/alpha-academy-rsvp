import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  createRsvpResponse: vi.fn(),
  getRsvpResponses: vi.fn(),
}));

import { createRsvpResponse, getRsvpResponses } from "./db";
import { appRouter } from "./routers";

const mockedCreateRsvpResponse = vi.mocked(createRsvpResponse);
const mockedGetRsvpResponses = vi.mocked(getRsvpResponses);

function createContext(role: "admin" | "user" | null = null): TrpcContext {
  const user = role
    ? {
        id: 1,
        openId: "alpha-owner",
        name: "Alpha Owner",
        email: "owner@alpha.example",
        loginMethod: "manus",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("rsvp router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores a valid public RSVP submission", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.rsvp.submit({
        fullName: "Rana Haddad",
        phoneNumber: "+963 944 123 456",
        guestRole: "student",
        attendanceStatus: "attending",
      }),
    ).resolves.toEqual({ success: true });

    expect(mockedCreateRsvpResponse).toHaveBeenCalledWith({
      fullName: "Rana Haddad",
      phoneNumber: "+963 944 123 456",
      guestRole: "student",
      attendanceStatus: "attending",
    });
  });

  it("rejects an invalid public RSVP phone number", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.rsvp.submit({
        fullName: "Rana Haddad",
        phoneNumber: "invalid-number",
        guestRole: "teacher",
        attendanceStatus: "attending",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(mockedCreateRsvpResponse).not.toHaveBeenCalled();
  });

  it("requires guests to select a role", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.rsvp.submit({
        fullName: "Rana Haddad",
        phoneNumber: "+963 944 123 456",
        attendanceStatus: "attending",
      } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(mockedCreateRsvpResponse).not.toHaveBeenCalled();
  });

  it("allows only the owner to retrieve RSVP responses", async () => {
    const response = {
      id: 1,
      fullName: "Rana Haddad",
      phoneNumber: "+963 944 123 456",
      guestRole: "student" as const,
      attendanceStatus: "attending" as const,
      submittedAt: new Date("2026-08-01T10:00:00.000Z"),
    };
    mockedGetRsvpResponses.mockResolvedValue([response]);

    const ownerCaller = appRouter.createCaller(createContext("admin"));
    await expect(ownerCaller.rsvp.list()).resolves.toEqual([response]);
    expect(mockedGetRsvpResponses).toHaveBeenCalledTimes(1);

    const userCaller = appRouter.createCaller(createContext("user"));
    await expect(userCaller.rsvp.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
