import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { SathiyaLogo } from "../SathiyaLogo";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Sparkles, Phone, ShieldCheck } from "lucide-react";

export const SignInScreen: React.FC = () => {
  const { setCurrentScreen } = useMobileApp();
  const [emailOrPhone, setEmailOrPhone] = useState("shivani@demo.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Instant smooth navigation to discovery feed
    setCurrentScreen("feed");
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col bg-white overflow-y-auto no-scrollbar select-none">
      {/* Top Banner Image with Couple (40% height) */}
      <div className="relative h-64 w-full shrink-0 overflow-hidden bg-orange-950">
        <img
          src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80"
          alt="Wedding Couple"
          className="w-full h-full object-cover object-top filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {/* Back Button */}
        <button
          onClick={() => setCurrentScreen("welcome")}
          className="absolute top-10 left-5 z-20 flex items-center gap-1 text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Curved White Sheet Overlapping the Header */}
      <div className="relative -mt-10 bg-white rounded-t-[32px] px-6 pt-10 pb-8 flex-1 flex flex-col justify-between shadow-2xl">
        {/* Floating Ring Logo Badge in Center Curve */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white p-2.5 rounded-2xl shadow-xl border border-orange-100 flex items-center justify-center">
          <SathiyaLogo size={42} />
        </div>

        <div>
          {/* Header */}
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-xs text-gray-500 mt-1">Welcome back! Please enter your details.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Input 1: Mobile No / Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Mobile No / Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Mobile No / Email"
                  className="w-full pl-10 pr-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Input 2: Password */}
            {loginMethod === "password" ? (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => alert("Password reset instructions have been sent to your registered email/phone.")}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  One Time Password (OTP)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full pl-10 pr-24 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setOtpSent(true)}
                    className="absolute right-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-200"
                  >
                    {otpSent ? "Resend" : "Get OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Saffron Primary Sign In Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-full bg-saffron-gradient text-white font-semibold text-sm shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="text-left">
                <p className="text-[11px] font-bold text-gray-800">Quick UI Demo Mode</p>
                <p className="text-[10px] text-gray-500">Sign in instantly without entering credentials</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentScreen("feed")}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Instant In
            </button>
          </div>

          {/* Switch to OTP Login */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setLoginMethod(loginMethod === "password" ? "otp" : "password")}
              className="text-xs text-gray-500 hover:text-orange-600 font-medium inline-flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-orange-500" />
              <span>{loginMethod === "password" ? "Sign In via SMS OTP" : "Sign In with Password"}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-xs text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setCurrentScreen("register")}
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Register Now !
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
