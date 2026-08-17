import { Button } from "@/components/ui/button";
import { CalendarDays, Check, CheckCircle2, Clock3, MapPin, Phone, Send, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";

type AttendanceStatus = "attending" | "not_attending";
type GuestRole = "student" | "teacher";

type FormState = {
  fullName: string;
  phoneNumber: string;
  guestRole: GuestRole | "";
  attendanceStatus: AttendanceStatus | "";
};

const initialForm: FormState = {
  fullName: "",
  phoneNumber: "",
  guestRole: "",
  attendanceStatus: "",
};

function DetailRow({
  icon,
  english,
  arabic,
}: {
  icon: React.ReactNode;
  english: string;
  arabic: string;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-[#d8b16c]/30 py-5 last:border-0">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#052b60] text-[#f1cf92]">{icon}</div>
      <div>
        <p className="text-sm font-semibold tracking-wide text-[#052b60]">{english}</p>
        <p lang="ar" dir="rtl" className="mt-1 font-arabic text-base text-[#805e1f]">
          {arabic}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const submitRsvp = trpc.rsvp.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm(initialForm);
    },
  });

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = "Please enter your full name.";
    if (form.phoneNumber.trim().length < 7) nextErrors.phoneNumber = "Please enter a valid phone number.";
    if (!form.guestRole) nextErrors.guestRole = "Please select your role.";
    if (!form.attendanceStatus) nextErrors.attendanceStatus = "Please choose an attendance option.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await submitRsvp.mutateAsync({
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      guestRole: form.guestRole as GuestRole,
      attendanceStatus: form.attendanceStatus as AttendanceStatus,
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#052b60]">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background:radial-gradient(circle_at_82%_2%,rgba(216,177,108,0.18),transparent_28%),radial-gradient(circle_at_8%_88%,rgba(5,43,96,0.07),transparent_30%)]" />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between border-b border-[#d8b16c]/45 pb-5">
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/alpha-academy-logo_b38e7d43.webp"
              alt="Alpha Academy"
              className="h-11 w-auto sm:h-14"
            />
            <div className="hidden border-l border-[#d8b16c]/60 pl-3 sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a97722]">Alpha Academy</p>
              <p lang="ar" dir="rtl" className="mt-0.5 font-arabic text-sm text-[#052b60]">أكاديمية ألفا</p>
            </div>
          </div>
          <p lang="ar" dir="rtl" className="font-arabic text-sm font-semibold text-[#805e1f] sm:text-base">
            حفل الإطلاق
          </p>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16 lg:py-14">
          <section className="relative">
            <div className="absolute -left-12 top-4 h-48 w-48 rounded-full border border-[#d8b16c]/35 sm:h-64 sm:w-64" />
            <div className="relative max-w-2xl">
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a97722]">
                <span className="h-px w-10 bg-[#d8b16c]" />
                Official invitation
              </div>
              <h1 lang="ar" dir="rtl" className="font-arabic text-4xl font-bold leading-[1.25] text-[#052b60] sm:text-5xl lg:text-6xl">
                ننتظركم في حفل إطلاق أكاديمية ألفا
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#52627b] sm:text-xl">
                Join us for an evening dedicated to a new way of learning the Syrian Baccalaureate curriculum.
              </p>
              <p lang="ar" dir="rtl" className="mt-3 max-w-xl font-arabic text-xl leading-8 text-[#805e1f]">
                نلتقي لنقدّم لكم تجربة تعليمية جديدة ومتكاملة.
              </p>

              <div className="mt-9 max-w-xl rounded-[1.6rem] border border-[#d8b16c]/45 bg-white/85 px-6 shadow-[0_16px_45px_rgba(5,43,96,0.08)] backdrop-blur-sm sm:px-8">
                <DetailRow
                  icon={<CalendarDays className="h-5 w-5" />}
                  english="20 August 2026"
                  arabic="20 آب 2026"
                />
                <DetailRow icon={<Clock3 className="h-5 w-5" />} english="6:00 PM" arabic="الساعة 6:00 مساءً" />
                <DetailRow
                  icon={<MapPin className="h-5 w-5" />}
                  english="Al-Saleeb Church Halls, Qassaa"
                  arabic="قاعات كنيسة الصليب، القصاع"
                />
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -right-6 -top-8 h-44 w-44 rounded-full bg-[#f5ead3]/70 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#d8b16c]/50 bg-white p-6 shadow-[0_24px_75px_rgba(5,43,96,0.13)] sm:p-9">
              <div className="absolute right-0 top-0 h-28 w-28 border-b border-l border-[#d8b16c]/40 [border-bottom-left-radius:100%]" />
              {submitted ? (
                <div className="flex min-h-[470px] flex-col items-center justify-center text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#052b60] text-[#f1cf92] shadow-lg">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 lang="ar" dir="rtl" className="mt-8 font-arabic text-3xl font-bold text-[#052b60]">
                    شكرًا لتأكيد حضوركم
                  </h2>
                  <p lang="ar" dir="rtl" className="mt-4 max-w-sm font-arabic text-lg leading-8 text-[#805e1f]">
                    تم تسجيل ردّكم بنجاح. نتطلّع إلى لقائكم في حفل إطلاق أكاديمية ألفا.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 border-[#052b60] text-[#052b60] hover:bg-[#052b60] hover:text-white"
                  >
                    Submit another RSVP
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a97722]">RSVP</p>
                    <h2 lang="ar" dir="rtl" className="mt-3 font-arabic text-3xl font-bold text-[#052b60]">
                      أكّدوا حضوركم
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#65718a]">Please complete the form below to let us know if you can join us.</p>
                  </div>

                  <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#052b60]">
                        <UserRound className="h-4 w-4 text-[#a97722]" />
                        Full name <span lang="ar" dir="rtl" className="font-arabic font-medium text-[#805e1f]">الاسم الكامل</span>
                      </span>
                      <input
                        value={form.fullName}
                        onChange={event => updateField("fullName", event.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        className="h-12 w-full rounded-xl border border-[#d8b16c]/50 bg-[#fffdf9] px-4 text-[#052b60] outline-none transition placeholder:text-[#9aa2b0] focus:border-[#052b60] focus:ring-4 focus:ring-[#052b60]/10"
                        aria-invalid={Boolean(errors.fullName)}
                      />
                      {errors.fullName && <span className="mt-1.5 block text-xs text-[#b44f43]">{errors.fullName}</span>}
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#052b60]">
                        <Phone className="h-4 w-4 text-[#a97722]" />
                        Phone number <span lang="ar" dir="rtl" className="font-arabic font-medium text-[#805e1f]">رقم الهاتف</span>
                      </span>
                      <input
                        value={form.phoneNumber}
                        onChange={event => updateField("phoneNumber", event.target.value)}
                        placeholder="+963 ..."
                        inputMode="tel"
                        autoComplete="tel"
                        className="h-12 w-full rounded-xl border border-[#d8b16c]/50 bg-[#fffdf9] px-4 text-[#052b60] outline-none transition placeholder:text-[#9aa2b0] focus:border-[#052b60] focus:ring-4 focus:ring-[#052b60]/10"
                        aria-invalid={Boolean(errors.phoneNumber)}
                      />
                      {errors.phoneNumber && <span className="mt-1.5 block text-xs text-[#b44f43]">{errors.phoneNumber}</span>}
                    </label>

                    <fieldset>
                      <legend className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#052b60]">
                        You are <span lang="ar" dir="rtl" className="font-arabic font-medium text-[#805e1f]">أنت</span>
                      </legend>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "student" as const, label: "Student", arabic: "طالب" },
                          { value: "teacher" as const, label: "Teacher", arabic: "أستاذ" },
                        ].map(option => {
                          const isSelected = form.guestRole === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateField("guestRole", option.value)}
                              className={`min-h-16 rounded-xl border p-3 text-left transition ${
                                isSelected
                                  ? "border-[#052b60] bg-[#052b60] text-white shadow-lg shadow-[#052b60]/15"
                                  : "border-[#d8b16c]/50 bg-[#fffdf9] text-[#052b60] hover:border-[#052b60]/70"
                              }`}
                              aria-pressed={isSelected}
                            >
                              <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                                {option.label}
                                {isSelected && <Check className="h-4 w-4 text-[#f1cf92]" />}
                              </span>
                              <span lang="ar" dir="rtl" className={`mt-1 block font-arabic text-sm ${isSelected ? "text-[#f8e8c8]" : "text-[#805e1f]"}`}>
                                {option.arabic}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.guestRole && <span className="mt-1.5 block text-xs text-[#b44f43]">{errors.guestRole}</span>}
                    </fieldset>

                    <fieldset>
                      <legend className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#052b60]">
                        Attendance confirmation <span lang="ar" dir="rtl" className="font-arabic font-medium text-[#805e1f]">تأكيد الحضور</span>
                      </legend>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "attending" as const, label: "Attending", arabic: "سأحضر" },
                          { value: "not_attending" as const, label: "Not attending", arabic: "لن أتمكّن من الحضور" },
                        ].map(option => {
                          const isSelected = form.attendanceStatus === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateField("attendanceStatus", option.value)}
                              className={`min-h-20 rounded-xl border p-3 text-left transition ${
                                isSelected
                                  ? "border-[#052b60] bg-[#052b60] text-white shadow-lg shadow-[#052b60]/15"
                                  : "border-[#d8b16c]/50 bg-[#fffdf9] text-[#052b60] hover:border-[#052b60]/70"
                              }`}
                              aria-pressed={isSelected}
                            >
                              <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                                {option.label}
                                {isSelected && <Check className="h-4 w-4 text-[#f1cf92]" />}
                              </span>
                              <span lang="ar" dir="rtl" className={`mt-1 block font-arabic text-sm ${isSelected ? "text-[#f8e8c8]" : "text-[#805e1f]"}`}>
                                {option.arabic}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.attendanceStatus && <span className="mt-1.5 block text-xs text-[#b44f43]">{errors.attendanceStatus}</span>}
                    </fieldset>

                    {submitRsvp.isError && (
                      <p className="rounded-lg bg-[#fff0ed] px-3 py-2 text-sm text-[#9d3f33]">
                        We could not record your RSVP. Please check your details and try again.
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={submitRsvp.isPending}
                      className="h-13 w-full rounded-xl bg-[#052b60] text-base font-semibold text-white shadow-lg shadow-[#052b60]/20 transition hover:bg-[#083a7a] active:scale-[0.98]"
                    >
                      {submitRsvp.isPending ? "Submitting…" : "Confirm RSVP"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
        <footer className="flex flex-col gap-3 border-t border-[#d8b16c]/45 pt-5 text-xs text-[#738099] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Alpha Academy. Event RSVP.</p>
          <a href="/admin" className="font-semibold text-[#805e1f] transition hover:text-[#052b60]">Organizer access</a>
        </footer>
      </main>
    </div>
  );
}
