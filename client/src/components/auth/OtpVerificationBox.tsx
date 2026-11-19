import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface OtpVerificationBoxProps {
  channelLabel: string;
  targetValue: string;
  demoOtp?: string;
  expiresAt?: number;
  lockedUntil?: number;
  errorMessage?: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onSimulateExpiry?: () => void;
}

export const OtpVerificationBox: React.FC<OtpVerificationBoxProps> = ({
  channelLabel,
  targetValue,
  demoOtp,
  expiresAt,
  lockedUntil,
  errorMessage,
  onVerify,
  onResend,
  onSimulateExpiry,
}) => {
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const expirySeconds = expiresAt
    ? Math.max(0, Math.floor((expiresAt - now) / 1000))
    : 0;
  const isExpired = !expiresAt || expirySeconds <= 0;

  const lockSeconds = lockedUntil
    ? Math.max(0, Math.ceil((lockedUntil - now) / 1000))
    : 0;
  const isLocked = lockSeconds > 0;

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp.trim());
  };

  const handleResendClick = () => {
    setOtp("");
    setResendCooldown(30);
    onResend();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Target Info Pill */}
      <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8C6D62]">
            OTP sent to {channelLabel}
          </p>
          <p className="text-base font-bold text-[#2B120C]">{targetValue}</p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isExpired
              ? "bg-rose-100 text-rose-700"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          {isExpired ? "OTP Expired" : `Expires in ${formatMMSS(expirySeconds)}`}
        </div>
      </div>

      {/* Demo OTP Helper Banner */}
      {demoOtp && (
        <div className="rounded-2xl bg-[#3B0A18] text-amber-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="text-sm">
              <span className="text-amber-200">Demo OTP: </span>
              <strong className="font-mono text-base tracking-widest text-white">
                {demoOtp}
              </strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setOtp(demoOtp)}
              className="h-8 rounded-lg text-xs font-semibold bg-amber-400 text-[#2B120C] hover:bg-amber-300"
            >
              Auto-fill OTP
            </Button>
            {onSimulateExpiry && !isExpired && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onSimulateExpiry}
                className="h-8 rounded-lg text-xs text-amber-200 hover:bg-white/10 hover:text-white"
              >
                Expire Test
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error / Rate-Limit Alert */}
      {(errorMessage || isLocked) && (
        <Alert variant="destructive" className="rounded-xl bg-rose-50 border-rose-200 text-rose-800">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription className="text-sm font-medium">
            {isLocked
              ? `Temporary security lock active — please try again in ${lockSeconds} seconds.`
              : errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* 6-digit OTP Input */}
      <div className="space-y-2">
        <label
          htmlFor="otp-code-input"
          className="block text-sm font-semibold text-[#4E342E]"
        >
          Enter 6-Digit OTP
        </label>
        <Input
          id="otp-code-input"
          inputMode="numeric"
          maxLength={6}
          required
          disabled={isLocked}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="● ● ● ● ● ●"
          className="h-14 text-center font-mono text-2xl tracking-[0.5em] rounded-xl border-amber-300 bg-[#FFFDF9] focus-visible:ring-[#FF7700]/40"
        />
      </div>

      {/* Verify & Resend Controls */}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={otp.length !== 6 || isLocked}
          className="w-full h-12 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Verify OTP
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
          <span className="text-[#5C4740]">Didn&apos;t receive the code or expired?</span>
          <button
            type="button"
            onClick={handleResendClick}
            disabled={resendCooldown > 0 && !isExpired}
            className={`inline-flex items-center gap-1.5 font-semibold ${
              resendCooldown > 0 && !isExpired
                ? "text-[#9E8A82] cursor-not-allowed"
                : "text-[#EA580C] hover:text-[#9A3412] underline underline-offset-4"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {resendCooldown > 0 && !isExpired
              ? `Resend OTP (${resendCooldown}s)`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </form>
  );
};
