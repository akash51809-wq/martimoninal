import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { VivahLogo } from "../VivahLogo";
import { ChevronLeft, Mail, Lock, Phone, User, Calendar, ShieldCheck, Heart, AlertCircle, Loader2 } from "lucide-react";
import { MOCK_COMMUNITIES } from "../../../data/mockData";

export const RegisterScreen: React.FC = () => {
  const { setCurrentScreen, registerUser, isLoadingAuth, authError, setAuthError } = useMobileApp();
  const [profileFor, setProfileFor] = useState("Self");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"Female" | "Male">("Female");
  const [dob, setDob] = useState("1998-05-15");
  const [caste, setCaste] = useState("Brahmin");
  const [step, setStep] = useState<1 | 2>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim()) return;
      setStep(2);
    } else {
      if (!mobile.trim() || !email.trim() || !password) return;
      const res = await registerUser({
        fullName,
        mobile,
        email,
        password,
        gender,
        dob,
        profileCreatedBy: profileFor,
      });
      if (!res.success) {
        // Error displayed via authError
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-white overflow-y-auto no-scrollbar select-none">
      {/* Top Banner Image (wedding garland ceremony) */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-amber-950">
        <img
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80"
          alt="Wedding Vows"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Back Button */}
        <button
          onClick={() => (step === 2 ? setStep(1) : setCurrentScreen("welcome"))}
          className="absolute top-10 left-5 z-20 flex items-center gap-1 text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Curved White Sheet Overlapping the Banner */}
      <div className="relative -mt-10 bg-white rounded-t-[32px] px-6 pt-10 pb-8 flex-1 flex flex-col shadow-2xl">
        {/* Floating Ring Logo Badge in Center Curve */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white p-2.5 rounded-2xl shadow-xl border border-orange-100 flex items-center justify-center">
          <VivahLogo size={42} />
        </div>

        {/* Header with "Register" and "Go to Login" */}
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-xs text-gray-500">Step {step} of 2 - {step === 1 ? "Personal Basics" : "Contact & Security"}</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentScreen("signin")}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            Sign In Instead
          </button>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            /* STEP 1: Basic Profile Info */
            <div className="space-y-3.5">
              {/* Profile Created By Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Profile Created For
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Self", "Son", "Daughter", "Brother", "Sister", "Friend"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setProfileFor(opt)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        profileFor === opt
                          ? "bg-orange-50 border-orange-500 text-orange-700 shadow-2xs"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Radio */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("Female")}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      gender === "Female"
                        ? "bg-rose-50 border-rose-400 text-rose-700 shadow-2xs"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <span>Bride (Female)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("Male")}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      gender === "Male"
                        ? "bg-blue-50 border-blue-400 text-blue-700 shadow-2xs"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <span>Groom (Male)</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Candidate's full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Date of Birth
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: Contact, Credentials & Community */
            <div className="space-y-3.5">
              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  10-Digit Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ""));
                      if (authError) setAuthError(null);
                    }}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="e.g. candidate@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Create Password (min. 6 characters)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Community / Caste */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Community / Caste
                </label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option>Brahmin</option>
                  <option>Maratha</option>
                  <option>Agarwal</option>
                  <option>Gupta</option>
                  <option>Rajput</option>
                  <option>Kayastha</option>
                  <option>Jat</option>
                  <option>Patel</option>
                  <option>Reddy</option>
                  <option>Other / Open to All</option>
                </select>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" id="terms" defaultChecked required className="mt-1 accent-orange-600 rounded" />
                <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
                  I agree to Vivah Kar Lo's Terms of Service and confirm all details are authentic for matrimonial verification.
                </label>
              </div>
            </div>
          )}

          {/* Saffron Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full py-3.5 rounded-full bg-saffron-gradient text-white font-semibold text-sm shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoadingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Registering Account in Database...</span>
                </>
              ) : (
                <span>{step === 1 ? "Next: Contact & Password →" : "Create My Matrimony Profile"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
