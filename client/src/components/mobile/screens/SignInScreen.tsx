import React, { useState } from "react";
import { useMobileApp } from "../../../context/MobileAppContext";
import { VivahLogo } from "../VivahLogo";
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Sparkles, Phone, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export const SignInScreen: React.FC = () => {
  const { setCurrentScreen, login, isLoadingAuth, authError, setAuthError } = useMobileApp();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) return;
    const res = await login(emailOrPhone, password);
    if (!res.success) {
      // Error handled and shown via authError
    }
  };

  const handleQuickLogin = async (identity: string, pass: string) => {
    setEmailOrPhone(identity);
    setPassword(pass);
    await login(identity, pass);
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
          <VivahLogo size={42} />
        </div>

        <div>
          {/* Header */}
          <div className="text-left mb-5">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-xs text-gray-500 mt-1">Access your Vivah Kar Lo account with live matchmaking.</p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Input 1: Mobile No / Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Registered Mobile No / Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="e.g. 9876543210 or yourname@gmail.com"
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter account password"
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
                    onClick={() => alert("Password reset instructions: Please contact support at +91 93358 19686 or email vivahkarlo@gmail.com")}
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
              disabled={isLoadingAuth}
              className="w-full mt-2 py-3.5 rounded-full bg-saffron-gradient text-white font-semibold text-sm shadow-saffron hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoadingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Account</span>
              )}
            </button>
          </form>

          {/* Quick Database Test Accounts */}
          <div className="mt-5 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
              <p className="text-[11px] font-bold text-gray-900">Instant Database Login Test:</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("9876543210", "Vivah@123")}
                disabled={isLoadingAuth}
                className="px-2.5 py-1.5 bg-white hover:bg-orange-50 border border-orange-200 rounded-xl text-left transition-colors"
              >
                <p className="text-[10px] font-bold text-orange-800 truncate">Arjun Deshmukh</p>
                <p className="text-[9px] text-gray-500">VIP (9876543210)</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("9811122233", "Vivah@123")}
                disabled={isLoadingAuth}
                className="px-2.5 py-1.5 bg-white hover:bg-orange-50 border border-orange-200 rounded-xl text-left transition-colors"
              >
                <p className="text-[10px] font-bold text-orange-800 truncate">Priya Kulkarni</p>
                <p className="text-[9px] text-gray-500">Parent (9811122233)</p>
              </button>
            </div>
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
              Register Free Now!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
