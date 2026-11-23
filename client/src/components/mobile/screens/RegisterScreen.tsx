import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { SathiyaLogo } from "../SathiyaLogo";
import { ChevronLeft, Mail, Lock, Phone, User, Calendar, ShieldCheck, Heart } from "lucide-react";
import { MOCK_COMMUNITIES } from "../../../data/mockData";

export const RegisterScreen: React.FC = () => {
  const { setCurrentScreen } = useMobileApp();
  const [profileFor, setProfileFor] = useState("Self");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"Female" | "Male">("Female");
  const [caste, setCaste] = useState("Maratha");
  const [step, setStep] = useState<1 | 2>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      alert("Registration Successful! Welcome to Vivah Kar Lo Matrimony.");
      setCurrentScreen("feed");
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
          <SathiyaLogo size={42} />
        </div>

        {/* Header with "Register" and "Go to Login" */}
        <div className="flex justify-between items-baseline mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Register</h2>
            <p className="text-xs text-gray-500">Step {step} of 2 - Basic Profile</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentScreen("signin")}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            Go to <span className="underline">Login</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
          {step === 1 ? (
            <div className="space-y-3.5">
              {/* Profile Created For */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Profile Created For
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Self", "Son", "Daughter", "Sibling"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setProfileFor(item)}
                      className={`py-2 text-xs rounded-xl border font-medium transition-all ${
                        profileFor === item
                          ? "bg-orange-50 border-orange-500 text-orange-700 font-bold"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
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
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Candidate's Full Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Email */}
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Mobile No */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Create Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("Female")}
                    className={`py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ${
                      gender === "Female"
                        ? "bg-orange-50 border-orange-500 text-orange-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <span>Bride (Female)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("Male")}
                    className={`py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ${
                      gender === "Male"
                        ? "bg-orange-50 border-orange-500 text-orange-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <span>Groom (Male)</span>
                  </button>
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
                    defaultValue="1999-05-15"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Community / Caste */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Religion & Caste
                </label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {MOCK_COMMUNITIES.filter((c) => c !== "All Communities").map((c) => (
                    <option key={c} value={c}>
                      Hindu - {c}
                    </option>
                  ))}
                  <option value="Jain">Jain - Shwetamber/Digamber</option>
                  <option value="Sikh">Sikh - Khatri/Arora</option>
                </select>
              </div>

              {/* Mother Tongue */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Mother Tongue
                </label>
                <select className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Gujarati</option>
                  <option>Punjabi</option>
                  <option>Bengali</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                </select>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input type="checkbox" id="terms" defaultChecked className="mt-1 accent-orange-600 rounded" />
                <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
                  I agree to Vivah Kar Lo's Terms of Service, Privacy Policy, and confirm that all details provided are accurate for matrimonial verification.
                </label>
              </div>
            </div>
          )}

          {/* Saffron Primary Register Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-saffron-gradient text-white font-semibold text-sm shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{step === 1 ? "Continue to Next Step →" : "Create My Matrimony Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
