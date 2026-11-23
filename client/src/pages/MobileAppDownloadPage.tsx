import React, { useState } from "react";
import { Link } from "wouter";
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  BellRing, 
  Heart,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { Button } from "@/components/ui/button";
import { MobileAppProvider } from "@/context/MobileAppContext";
import MobileDeviceShell from "@/components/mobile/MobileDeviceShell";

export default function MobileAppDownloadPage() {
  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E293B]">
      {/* Top Heritage Bar */}
      <div className="w-full bg-[#1B090D] border-b border-amber-400/20 py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Vivah Kar Lo Homepage
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Official Release v1.0.0
          </div>
        </div>
      </div>

      {/* Main Download Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Brand & Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <VivahBrandLogo size="lg" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#C2410C] text-xs sm:text-sm font-bold">
            <Smartphone className="w-4 h-4 text-[#EA580C]" />
            Official Production Mobile Application
          </div>
          <h1 className="font-serif-royal text-3xl sm:text-5xl font-bold text-[#2B120C] tracking-tight">
            Download Vivah Kar Lo Mobile App
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5C4740]">
            Experience seamless matchmaking on your Android device with biometric security, real-time push alerts, and 36-Guna Vedic Kundli compatibility.
          </p>
        </div>

        {/* Primary Download Showcase Box */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF4E6] via-white to-[#FFEAD5] border-2 border-amber-300/80 shadow-[0_20px_60px_-15px_rgba(154,52,18,0.15)] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Download Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C]">Direct APK Download</span>
                <h2 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                  Vivah Kar Lo for Android
                </h2>
                <p className="text-sm sm:text-base text-[#5C4740]">
                  Download and install our native release APK package directly on any modern Android smartphone or tablet.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/downloads/vivahkarlo-release.apk"
                    download="vivahkarlo-release.apk"
                    className="block w-full sm:w-auto"
                  >
                    <Button
                      type="button"
                      className="w-full sm:w-auto h-14 px-8 rounded-full bg-saffron-gradient hover:opacity-95 text-white font-bold text-base shadow-saffron-md flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                    >
                      <Download className="w-5 h-5" />
                      Download Android APK (v1.0.0)
                    </Button>
                  </a>
                  <Link href="/app" className="block w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto h-14 px-6 rounded-full border-2 border-amber-300 text-[#C2410C] hover:bg-amber-50 font-bold text-base flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Open App in Browser
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-[#8C7A74]">
                  Package: <code className="bg-amber-100/70 px-1.5 py-0.5 rounded font-mono">in.vivahkarlo.app</code> • File size: ~4 MB • 100% Virus &amp; Malware Free
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-[#4E342E]">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Biometric Instant Unlock (Face ID/Fingerprint)</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Real-Time Push Notifications</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>EXIF GPS Privacy Stripping</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>36-Guna Vedic Kundli Reports</span>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code Direct Mobile Scan */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-amber-200/80 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#721422]">
                <QrCode className="w-10 h-10 text-[#EA580C]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#2B120C]">Scan to Download on Phone</h3>
                <p className="text-xs text-[#6B5349] max-w-xs">
                  Scan the link using your phone's camera to initiate direct APK download on your device.
                </p>
              </div>
              <a
                href="/downloads/vivahkarlo-release.apk"
                download="vivahkarlo-release.apk"
                className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Direct Link: /downloads/vivahkarlo-release.apk
              </a>
            </div>

          </div>
        </div>

        {/* 3-Step Installation Guide */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C]">
              How to Install APK on Android
            </h3>
            <p className="text-sm text-[#6B5349]">
              Installing the APK takes less than 30 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-saffron-gradient text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-base text-[#2B120C]">Download APK</h4>
              <p className="text-xs sm:text-sm text-[#5C4740] leading-relaxed">
                Click the orange download button above to save <code className="bg-amber-50 px-1 py-0.5 rounded text-amber-900 font-mono">vivahkarlo-release.apk</code> to your Android device.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-saffron-gradient text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-base text-[#2B120C]">Allow Install</h4>
              <p className="text-xs sm:text-sm text-[#5C4740] leading-relaxed">
                If prompted with "Install unknown apps", tap <strong>Settings</strong> and switch <strong>Allow from this source</strong> to ON.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="w-8 h-8 rounded-full bg-saffron-gradient text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-base text-[#2B120C]">Open &amp; Sign In</h4>
              <p className="text-xs sm:text-sm text-[#5C4740] leading-relaxed">
                Tap <strong>Install</strong>, then open the app and sign in with your mobile number or email. You are all set!
              </p>
            </div>
          </div>
        </div>

        {/* Optional Interactive Browser Simulator Preview */}
        <div className="border border-amber-200/70 rounded-2xl p-6 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-[#2B120C]">Web Browser App Simulator</h4>
              <p className="text-xs text-[#6B5349]">
                Preview the interactive mobile screen flow directly inside this web browser without installing the APK.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSimulator((prev) => !prev)}
              className="rounded-xl border-amber-300 text-[#3B0A18] font-semibold text-xs flex items-center gap-1.5 shrink-0"
            >
              <Smartphone className="w-4 h-4 text-[#EA580C]" />
              {showSimulator ? "Hide Browser Simulator" : "Preview in Browser Simulator"}
              {showSimulator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {showSimulator && (
            <div className="pt-4 border-t border-amber-100 flex justify-center">
              <div className="w-full max-w-sm">
                <MobileAppProvider>
                  <MobileDeviceShell />
                </MobileAppProvider>
              </div>
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <div className="text-center pt-4 text-xs text-[#8C7A74] space-y-1">
          <p>Need assistance installing or downloading? Contact 24×7 Family Concierge at <strong>+91 93358 19686</strong> or email <strong>vivahkarlo@gmail.com</strong></p>
          <p>© {new Date().getFullYear()} Vivah Kar Lo. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
