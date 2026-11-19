import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Sparkles, CheckCircle2, Phone, Mail, Lock } from "lucide-react";

interface AuthQuickModalProps {
  open: boolean;
  initialTab: "login" | "register";
  selectedPlanName?: string | null;
  onOpenChange: (open: boolean) => void;
}

export const AuthQuickModal: React.FC<AuthQuickModalProps> = ({
  open,
  initialTab,
  selectedPlanName,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [profileFor, setProfileFor] = useState("Self");
  const [gender, setGender] = useState("Bride (Female)");
  const [fullName, setFullName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setSubmitted(false);
  }, [initialTab, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title:
        activeTab === "register"
          ? "Free Profile Reserved on Vivah Kar Lo!"
          : "Welcome Back to Vivah Kar Lo",
      description:
        activeTab === "register"
          ? `Namaste ${fullName || "Friend"}! Next step: full profile & OTP onboarding in Phase 1.`
          : "Demo sign-in preview verified. Full OTP & Dashboard flow coming next in Phase 1.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl border border-amber-200 bg-[#FFFDF9] p-0 overflow-hidden">
        {/* Top Royal Saffron Accent Banner */}
        <div className="bg-gradient-to-r from-[#3B0A18] via-[#5E162B] to-[#3B0A18] px-6 py-5 text-white">
          <DialogHeader className="text-left space-y-2">
            <div className="flex items-center justify-between">
              <VivahBrandLogo size="md" darkBg={true} />
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-amber-200 border border-amber-300/20">
                <ShieldCheck className="w-4 h-4" />
                100% Private
              </span>
            </div>
            <DialogTitle className="font-serif-royal text-2xl text-white pt-1">
              {selectedPlanName
                ? `Continue with ${selectedPlanName}`
                : activeTab === "register"
                ? "Create Your Free Family Profile"
                : "Sign In to Your Account"}
            </DialogTitle>
            <DialogDescription className="text-amber-100/85 text-sm">
              {activeTab === "register"
                ? "Join 2.4M+ verified individuals and families seeking meaningful life partners."
                : "Access your matches, accepted interests, Kundli reports, and family chat."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-amber-50 border border-amber-200/70 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setSubmitted(false);
              }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "register"
                  ? "bg-saffron-gradient text-white shadow-sm"
                  : "text-[#5C4740] hover:text-[#3B0A18]"
              }`}
            >
              Register Free
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setSubmitted(false);
              }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-saffron-gradient text-white shadow-sm"
                  : "text-[#5C4740] hover:text-[#3B0A18]"
              }`}
            >
              Sign In
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                {activeTab === "register"
                  ? "Registration Details Saved!"
                  : "Signed In (UI Preview)"}
              </h3>
              <p className="text-sm text-[#5C4740] max-w-xs mx-auto">
                {activeTab === "register"
                  ? "Your quick profile starter is ready. Complete Registration, Dashboard & OTP verification flows are part of Phase 1 next steps."
                  : "Welcome back! You can continue browsing verified matches on the homepage."}
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="rounded-xl bg-saffron-gradient text-white px-6 mt-2"
              >
                Continue Exploring Matches
              </Button>
            </div>
          ) : activeTab === "register" ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold text-[#4E342E]">
                    Profile Created For
                  </Label>
                  <select
                    value={profileFor}
                    onChange={(e) => setProfileFor(e.target.value)}
                    className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-sm text-[#2B120C]"
                  >
                    <option>Self</option>
                    <option>Son</option>
                    <option>Daughter</option>
                    <option>Sibling</option>
                    <option>Relative / Friend</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#4E342E]">
                    Looking As
                  </Label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-sm text-[#2B120C]"
                  >
                    <option>Bride (Female)</option>
                    <option>Groom (Male)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#4E342E]">
                  Candidate Full Name
                </Label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Aarav Kulkarni"
                  className="mt-1 h-11 rounded-xl border-amber-200 bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold text-[#4E342E]">
                    Mobile Number / Email
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 text-amber-600 absolute left-3 top-3.5" />
                    <Input
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="pl-9 h-11 rounded-xl border-amber-200 bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#4E342E]">
                    Current City
                  </Label>
                  <Input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Pune / Mumbai"
                    className="mt-1 h-11 rounded-xl border-amber-200 bg-white text-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm mt-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Register Free &amp; View Matches
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-[#4E342E]">
                  Email Address or Mobile Number
                </Label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 text-amber-600 absolute left-3 top-3.5" />
                  <Input
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="you@example.com or +91 98200..."
                    className="pl-9 h-11 rounded-xl border-amber-200 bg-white text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold text-[#4E342E]">
                  Password or OTP
                </Label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-amber-600 absolute left-3 top-3.5" />
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-9 h-11 rounded-xl border-amber-200 bg-white text-sm"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-saffron-gradient hover:opacity-95 text-white font-semibold text-base shadow-saffron-sm"
              >
                Sign In Securely
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
