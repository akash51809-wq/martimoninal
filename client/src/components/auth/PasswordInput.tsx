import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  colorClass: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) {
    return { score, label: "Weak", colorClass: "bg-rose-500" };
  }
  if (score <= 3) {
    return { score, label: "Medium", colorClass: "bg-amber-500" };
  }
  return { score, label: "Strong", colorClass: "bg-emerald-600" };
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "Minimum 8 characters",
  showStrength = false,
  required = true,
  autoComplete = "current-password",
}) => {
  const [visible, setVisible] = useState(false);
  const strength = getPasswordStrength(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Lock className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 pl-10 pr-12 rounded-xl border-amber-200 bg-[#FFFDF9] text-base sm:text-[15px] focus-visible:ring-[#FF7700]/40"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#6E564E] hover:text-[#EA580C] hover:bg-amber-50 transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className={`h-1.5 rounded-full transition-colors ${
                  strength.score >= lvl ? strength.colorClass : "bg-amber-100"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-[#5C4740]">
            Password Strength: <span className="font-semibold">{strength.label}</span>
          </p>
        </div>
      )}
    </div>
  );
};
