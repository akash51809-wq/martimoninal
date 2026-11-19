import React, { useState } from "react";
import { Link } from "wouter";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Database,
  Users,
  Activity,
} from "lucide-react";

interface AdminLoginViewProps {
  onLoginSuccess: (adminEmail: string, token: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Please enter both administrator email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid administrator credentials or PIN.");
        return;
      }

      onLoginSuccess(cleanEmail, data.token);
    } catch {
      setError("Failed to reach administrative gateway. Check your server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    setEmail("admin@vivahkarlo.in");
    setPassword("Admin@123");
    setPin("123456");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B120C] flex flex-col overflow-x-hidden">
      {/* Top Bar */}
      <header className="w-full bg-[#FFFDF9]/98 border-b border-amber-200/80">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-[72px] sm:h-[84px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 hover:bg-orange-100 border border-amber-200 text-[#3B0A18]"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="group">
              <VivahBrandLogo size="sm" />
            </Link>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3B0A18] text-amber-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Admin Command Center
          </span>
        </div>
      </header>

      {/* Split Layout */}
      <main className="flex-1 w-full grid lg:grid-cols-12">
        {/* Left Rosewood Security Panel */}
        <aside className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#2B0712] via-[#3F0C1C] to-[#1D040C] text-amber-50 p-10 xl:p-14 flex-col justify-between">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-sm font-semibold">
              <Lock className="w-4 h-4" />
              Restricted Role-Based Access
            </span>

            <h2 className="font-serif-royal text-3xl xl:text-4xl font-bold text-white leading-snug">
              Vivah Kar Lo Admin &amp; Database Portal
            </h2>

            <p className="text-base text-amber-100/80 leading-relaxed">
              Manage live user accounts, inspect database tables, approve KYC identity checks, monitor payments, and enforce Trust &amp; Safety policies.
            </p>

            <div className="space-y-3.5 pt-4">
              {[
                {
                  icon: Database,
                  text: "Live Database Explorer across 8 schema tables + JSON/CSV export",
                },
                {
                  icon: Users,
                  text: "Instant User Control (Verify, Suspend, Delete, Upgrade VIP)",
                },
                {
                  icon: Activity,
                  text: "KYC Queue, Revenue Analytics, Coupons, Abuse Reports & Audit Logs",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="flex items-start gap-3 text-sm text-amber-100/90"
                  >
                    <Icon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-8 border-t border-amber-200/15 text-xs text-amber-200/75">
            Protected with 2FA PIN &amp; Audit Trail Logging • Demo Mode Active
          </div>
        </aside>

        {/* Right Admin Login Form */}
        <section className="lg:col-span-7 flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-14 bg-gradient-to-b from-[#FFF9F2] to-[#FFFDF9]">
          <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-amber-200 shadow-[0_20px_60px_-15px_rgba(124,45,18,0.14)] p-6 sm:p-9 space-y-6">
            <div className="space-y-1.5">
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Admin Portal Sign In
              </h1>
              <p className="text-sm sm:text-base text-[#5C4740]">
                Enter your administrator credentials and 2FA PIN to access the control panel.
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="rounded-xl bg-rose-50 border-rose-200 text-rose-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-email"
                  className="text-sm font-semibold text-[#4E342E]"
                >
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@vivahkarlo.in"
                    className="h-12 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] text-base sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-semibold text-[#4E342E]"
                >
                  Admin Password
                </Label>
                <PasswordInput
                  id="admin-password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter admin password"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-pin"
                  className="text-sm font-semibold text-[#4E342E]"
                >
                  2FA Security PIN (6 Digits)
                </Label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="admin-pin"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    className="h-12 pl-10 rounded-xl border-amber-200 bg-[#FFFDF9] font-mono tracking-widest text-base"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-saffron-gradient text-white font-semibold text-base shadow-saffron-sm disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                {isSubmitting ? "Verifying Credentials..." : "Sign In to Admin Dashboard"}
              </Button>
            </form>

            {/* Demo Admin Helper */}
            <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#5C4740]">
                <p className="font-bold text-[#3B0A18] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                  Demo Super Admin
                </p>
                <p>
                  Email: <code className="font-mono">admin@vivahkarlo.in</code> • Pass:{" "}
                  <code className="font-mono">Admin@123</code> • PIN:{" "}
                  <code className="font-mono">123456</code>
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
                className="rounded-xl border-amber-300 text-[#3B0A18] font-semibold shrink-0"
              >
                Auto-Fill Admin
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
