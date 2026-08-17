import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, LockKeyhole, UsersRound } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

function formatSubmissionDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function Admin() {
  const { user, loading } = useAuth();
  const isOwner = user?.role === "admin";
  const responsesQuery = trpc.rsvp.list.useQuery(undefined, {
    enabled: isOwner,
  });

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-2rem)] bg-[#fffdf9] px-2 py-4 sm:px-5 sm:py-8">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-[#052b60]">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : !isOwner ? (
          <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center rounded-[2rem] border border-[#d8b16c]/35 bg-white p-10 text-center shadow-[0_20px_70px_rgba(5,43,96,0.08)]">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#052b60] text-white">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <p lang="ar" dir="rtl" className="font-arabic text-xl font-bold text-[#052b60]">
              هذه الصفحة مخصّصة لمالك الفعالية فقط
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#4e5d74]">
              This response dashboard is restricted to the Alpha Academy owner.
            </p>
            <Button asChild className="mt-6 bg-[#052b60] text-white hover:bg-[#083a7a]">
              <Link href="/">Back to confirmation page</Link>
            </Button>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl">
            <header className="flex flex-col gap-5 border-b border-[#d8b16c]/50 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#a97722]">
                  <span className="h-px w-8 bg-[#d8b16c]" />
                  Alpha Academy
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-[#052b60] sm:text-4xl">
                  Confirmation responses
                </h1>
                <p lang="ar" dir="rtl" className="mt-2 font-arabic text-lg text-[#7b5a1b]">
                  قائمة تأكيد الحضور للفعالية
                </p>
              </div>
              <Badge className="w-fit rounded-full bg-[#f5ead3] px-3 py-1 text-sm font-semibold text-[#805e1f] hover:bg-[#f5ead3]">
                {responsesQuery.data?.length ?? 0} responses
              </Badge>
            </header>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#d8b16c]/35 bg-white shadow-[0_20px_60px_rgba(5,43,96,0.08)]">
              {responsesQuery.isLoading ? (
                <div className="flex min-h-64 items-center justify-center text-[#052b60]">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>
              ) : responsesQuery.isError ? (
                <div className="p-10 text-center">
                  <p className="font-semibold text-[#052b60]">Unable to load RSVP responses.</p>
                  <p className="mt-2 text-sm text-[#6c7180]">Please refresh and try again.</p>
                </div>
              ) : responsesQuery.data?.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center p-10 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f7f0e3] text-[#a97722]">
                    <UsersRound className="h-6 w-6" />
                  </div>
                    <p className="mt-5 font-semibold text-[#052b60]">No confirmation responses yet</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#6c7180]">
                    Responses submitted through the public confirmation page will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left">
                    <thead className="bg-[#f9f5ed] text-xs font-bold uppercase tracking-[0.12em] text-[#6f5629]">
                      <tr>
                        <th className="px-6 py-4">Guest</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Phone number</th>
                        <th className="px-6 py-4">Attendance</th>
                        <th className="px-6 py-4">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadcc0] text-sm text-[#24344d]">
                      {responsesQuery.data?.map(response => (
                        <tr key={response.id} className="transition-colors hover:bg-[#fffdf9]">
                          <td className="px-6 py-5 font-semibold text-[#052b60]">{response.fullName}</td>
                          <td className="px-6 py-5">
                            <Badge className="rounded-full bg-[#f5ead3] px-3 py-1 text-[#805e1f] hover:bg-[#f5ead3]">
                              {response.guestRole === "student" ? "طالب · Student" : response.guestRole === "teacher" ? "أستاذ · Teacher" : "Not provided"}
                            </Badge>
                          </td>
                          <td className="px-6 py-5 font-mono text-xs text-[#475a79]">{response.phoneNumber}</td>
                          <td className="px-6 py-5">
                            <Badge
                              className={
                                response.attendanceStatus === "attending"
                                  ? "rounded-full bg-[#e9f2e9] px-3 py-1 text-[#2d6a4f] hover:bg-[#e9f2e9]"
                                  : "rounded-full bg-[#f8e7e4] px-3 py-1 text-[#9d3f33] hover:bg-[#f8e7e4]"
                              }
                            >
                              {response.attendanceStatus === "attending" ? "Attending" : "Not attending"}
                            </Badge>
                          </td>
                          <td className="px-6 py-5 text-[#596b87]">{formatSubmissionDate(response.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
