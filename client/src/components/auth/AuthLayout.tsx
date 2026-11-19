import React from "react";
import { Link } from "wouter";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  activeStep?: 1 | 2 | 3 | 4;
  showSteps?: boolean;
  topRightLink?: { label: string; href: string };
  children: React.ReactNode;
}

const REGISTRATION_STEPS = [
  { num: 1, title: "Create Account", desc: "Name, mobile, email & password" },
  { num: 2, title: "Mobile OTP", desc: "Verify your mobile number" },
  { num: 3, title: "Email Verification", desc: "Verify your email address" },
  { num: 4, title: "Profile Created By", desc: "Complete account setup" },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  activeStep,
  showSteps = false,
  topRightLink,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B120C] flex flex-col overflow-x-hidden">
      {/* Top Responsive Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/98 border-b border-amber-200/80">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-[70px] sm:h-[84px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 hover:bg-orange-100 border border-amber-200 text-[#3B0A18] transition-colors"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="group">
              <VivahBrandLogo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              256-bit Secure Auth
            </span>
            {topRightLink && (
              <Link
                href={topRightLink.href}
                className="px-4 sm:px-5 py-2.5 rounded-full bg-amber-50 hover:bg-orange-100 border border-amber-300 text-sm font-semibold text-[#3B0A18] transition-colors"
              >
                {topRightLink.label}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="flex-1 w-full grid lg:grid-cols-12">
        {/* Left Heritage / Step Panel (Desktop) */}
        <aside className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-gradient-to-br from-[#2B0712] via-[#3F0C1C] to-[#240610] text-amber-50 p-10 xl:p-12 flex-col justify-between relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)]"
          />

          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Vivah Kar Lo • Account Portal
            </span>

            <h2 className="font-serif-royal text-3xl xl:text-4xl font-bold text-white leading-snug">
              Begin Your Journey to a Trusted Family Alliance
            </h2>

            <p className="text-base text-amber-100/80 leading-relaxed">
              Account authentication and Matrimonial Profile completion are managed as separate steps—ensuring every member connects only after full verification.
            </p>

            {showSteps && activeStep ? (
              <div className="pt-4 space-y-4">
                {REGISTRATION_STEPS.map((st) => {
                  const isDone = st.num < activeStep;
                  const isCurrent = st.num === activeStep;
                  return (
                    <div
                      key={st.num}
                      className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-white/10 border-amber-400/60"
                          : isDone
                          ? "bg-emerald-500/10 border-emerald-400/30"
                          : "bg-white/[0.03] border-white/10 opacity-70"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-saffron-gradient text-white"
                            : "bg-white/10 text-amber-200"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{st.title}</p>
                        <p className="text-xs text-amber-200/80">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pt-4 space-y-3.5">
                {[
                  "Dual verification via Mobile & Email OTP",
                  "Automatic rate limiting on repeated failed attempts",
                  "Resume incomplete registration right where you left off",
                  "Unified account across Web and Mobile App",
                ].map((pt) => (
                  <div key={pt} className="flex items-start gap-3 text-sm text-amber-100/90">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 pt-8 border-t border-amber-200/15 flex items-center gap-2.5 text-sm text-amber-200/80">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Demo UI Mode • Backend APIs connect in Phase 2</span>
          </div>
        </aside>

        {/* Right Form Workspace */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-14 bg-gradient-to-b from-[#FFF9F2] to-[#FFFDF9]">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Mobile Compact Step Progress Bar */}
            {showSteps && activeStep && (
              <div className="lg:hidden bg-white rounded-2xl p-3.5 border border-amber-200/80 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-[#EA580C] mb-2">
                  <span>Step {activeStep} of 4</span>
                  <span>
                    {REGISTRATION_STEPS.find((s) => s.num === activeStep)?.title}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {REGISTRATION_STEPS.map((st) => (
                    <div
                      key={st.num}
                      className={`h-2 rounded-full transition-all ${
                        st.num <= activeStep
                          ? "bg-saffron-gradient"
                          : "bg-amber-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-amber-200/90 shadow-[0_20px_60px_-15px_rgba(124,45,18,0.12)] p-5 sm:p-8 lg:p-10 space-y-6">
              <div className="space-y-1.5">
                <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                  {title}
                </h1>
                <p className="text-sm sm:text-base text-[#5C4740]">{subtitle}</p>
              </div>

              {children}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
