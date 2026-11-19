import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthAccount } from "@/context/AuthAccountContext";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Step1PhysicalData,
  Step2ReligiousData,
  Step3EducationCareerData,
  Step4LifestyleData,
  Step5FamilyData,
  Step6PhotosBioData,
} from "@/types/matrimonialProfileTypes";
import { Step1BasicPhysical } from "@/components/profile-wizard/Step1BasicPhysical";
import { Step2ReligiousSocial } from "@/components/profile-wizard/Step2ReligiousSocial";
import { Step3EducationCareer } from "@/components/profile-wizard/Step3EducationCareer";
import { Step4LifestyleHabits } from "@/components/profile-wizard/Step4LifestyleHabits";
import { Step5FamilyBackground } from "@/components/profile-wizard/Step5FamilyBackground";
import { Step6PhotoBioPrivacy } from "@/components/profile-wizard/Step6PhotoBioPrivacy";
import {
  User,
  Sparkles,
  GraduationCap,
  Utensils,
  Users,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  PartyPopper,
  ShieldCheck,
  Home,
  LogOut,
} from "lucide-react";

const WIZARD_STEPS = [
  { id: 1, label: "Basic & Physical", icon: User },
  { id: 2, label: "Religious & Social", icon: Sparkles },
  { id: 3, label: "Education & Career", icon: GraduationCap },
  { id: 4, label: "Lifestyle & Habits", icon: Utensils },
  { id: 5, label: "Family Background", icon: Users },
  { id: 6, label: "Photos & Privacy", icon: Camera },
];

export default function ProfileWizardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentAccount, updateProfileProgress, logout } = useAuthAccount();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  // Profile Form States
  const [step1Data, setStep1Data] = useState<Partial<Step1PhysicalData>>({
    heightCm: 175,
    heightDisplay: "5 ft 9 in (175 cm)",
    weightKg: 68,
    bloodGroup: "B+",
    physicalStatus: "Normal",
    maritalStatus: "Never Married",
    bodyType: "Average",
  });

  const [step2Data, setStep2Data] = useState<Partial<Step2ReligiousData>>({
    religion: "Hindu",
    caste: "Brahmin",
    motherTongue: "Hindi",
    manglikStatus: "Non-Manglik",
    rashi: "Tula (Libra)",
  });

  const [step3Data, setStep3Data] = useState<Partial<Step3EducationCareerData>>({
    highestDegree: "B.Tech / B.E / Engineering",
    collegeUniversity: "Delhi University",
    employedIn: "Private Company",
    occupation: "Software Engineer",
    annualIncome: "₹15 - 25 Lakhs",
    workCity: "Delhi NCR",
    workState: "Delhi",
    workCountry: "India",
  });

  const [step4Data, setStep4Data] = useState<Partial<Step4LifestyleData>>({
    diet: "Pure Vegetarian",
    smoking: "No",
    drinking: "No",
    hobbies: ["Travelling & Trekking", "Reading & Literature", "Classical / Bollywood Music"],
  });

  const [step5Data, setStep5Data] = useState<Partial<Step5FamilyData>>({
    fatherOccupation: "Government Service / PSU",
    motherOccupation: "Homemaker",
    brothersCount: 1,
    brothersMarried: 0,
    sistersCount: 0,
    sistersMarried: 0,
    familyType: "Nuclear",
    familyValues: "Moderate",
    familyStatus: "Upper Middle Class",
    nativePlace: "Varanasi, Uttar Pradesh",
  });

  const [step6Data, setStep6Data] = useState<Partial<Step6PhotosBioData>>({
    primaryPhotoUrl: "/2.jpg",
    galleryPhotoUrls: ["/1.jpg"],
    photoPrivacy: "Visible to All",
    bio: "Passionate about my career and deeply committed to family harmony. Seeking a genuine life partner who values mutual respect, communication, and shared cultural values.",
  });

  // Calculate dynamic live score (0% - 100%)
  const completionPercentage = useMemo(() => {
    let score = 0;
    // Step 1
    if (step1Data.heightCm && step1Data.weightKg && step1Data.maritalStatus) score += 15;
    // Step 2
    if (step2Data.religion && step2Data.caste && step2Data.motherTongue) score += 15;
    // Step 3
    if (step3Data.highestDegree && step3Data.occupation && step3Data.annualIncome && step3Data.workCity) score += 20;
    // Step 4
    if (step4Data.diet && step4Data.smoking && step4Data.drinking) score += 10;
    // Step 5
    if (step5Data.fatherOccupation && step5Data.familyType && step5Data.nativePlace) score += 20;
    // Step 6
    if (step6Data.primaryPhotoUrl && (step6Data.bio?.length || 0) >= 15) score += 20;

    return Math.min(100, Math.max(10, score));
  }, [step1Data, step2Data, step3Data, step4Data, step5Data, step6Data]);

  useEffect(() => {
    document.title = `Profile Wizard (${completionPercentage}%) - Vivah Kar Lo`;
  }, [completionPercentage]);

  // Sync to database
  const saveCurrentStep = async (stepNum: number, showToast = true) => {
    if (!currentAccount) return;
    setSaving(true);

    let payload: any = {};
    if (stepNum === 1) payload = step1Data;
    else if (stepNum === 2) payload = step2Data;
    else if (stepNum === 3) payload = step3Data;
    else if (stepNum === 4) payload = step4Data;
    else if (stepNum === 5) payload = step5Data;
    else if (stepNum === 6) payload = step6Data;

    try {
      const res = await fetch(`/api/v1/profile/${currentAccount.user.id}/step/${stepNum}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        updateProfileProgress(completionPercentage, currentAccount.user.id);
        if (showToast) {
          toast({
            title: `Step ${stepNum} Saved`,
            description: `Profile completion is now at ${completionPercentage}%.`,
          });
        }
      }
    } catch (e) {
      console.warn("[Wizard] Offline draft save:", e);
      updateProfileProgress(completionPercentage, currentAccount.user.id);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveCurrentStep(activeStep, false);
    if (activeStep < 6) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinalize();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalize = async () => {
    if (!currentAccount) return;
    setSaving(true);
    try {
      await fetch(`/api/v1/profile/${currentAccount.user.id}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      updateProfileProgress(100, currentAccount.user.id);
      toast({
        title: "Matrimonial Profile Completed!",
        description: "Welcome to Vivah Kar Lo! Your profile is now 100% active and discoverable.",
      });
      setLocation("/dashboard");
    } catch {
      updateProfileProgress(100, currentAccount.user.id);
      setLocation("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2B120C] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/98 border-b border-amber-200/80 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-[68px] sm:h-[78px] flex items-center justify-between gap-4">
          <Link href="/" className="group shrink-0">
            <VivahBrandLogo size="sm" />
          </Link>

          {/* User Badge & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="font-bold text-[#2B120C]">
                {currentAccount ? currentAccount.user.fullName : "New Member"}
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Account
              </span>
            </div>

            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-amber-300 text-[#3B0A18] h-9 px-3.5 text-xs font-semibold"
              >
                <Home className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                Dashboard
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="rounded-full text-[#785C52] hover:text-rose-700 h-9 px-2.5 text-xs"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* Dynamic Completion Meter Banner */}
        <div className="mb-8 rounded-2xl bg-white border border-amber-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-100 text-[#EA580C]">
                  <PartyPopper className="w-5 h-5" />
                </span>
                <h1 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C]">
                  Matrimonial Profile Creation Wizard
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#5C4740] mt-1">
                Complete all 6 steps below to unlock partner discovery, daily match recommendations, and instant Kundli matching.
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300">
                <span className="text-xs font-bold text-[#785C52] uppercase">
                  Profile Strength:
                </span>
                <span className="text-sm font-extrabold text-[#EA580C]">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-amber-100/70 overflow-hidden border border-amber-200/60">
            <div
              className="h-full bg-saffron-gradient transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Micro-milestone indicators */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs text-[#8C6D62] mt-2 font-medium px-1">
            <span>0% (Account Created)</span>
            <span>50% (Basic, Caste &amp; Career)</span>
            <span>100% (Ready for Alliances)</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vertical Stepper Navigation (Desktop) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-amber-200/90 p-5 shadow-sm space-y-2 sticky top-[100px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C6D62] mb-3">
              Wizard Steps (6 Steps)
            </h3>

            {WIZARD_STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.id;
              const isPast = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    saveCurrentStep(activeStep, false);
                    setActiveStep(step.id);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-amber-100/90 border-[#EA580C] shadow-sm text-[#3B0A18] font-bold"
                      : isPast
                      ? "bg-amber-50/50 border-amber-200 text-[#4E342E] hover:bg-amber-50"
                      : "bg-white border-transparent text-[#785C52] hover:bg-amber-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? "bg-saffron-gradient text-white shadow-sm"
                          : isPast
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-[#785C52]"
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : step.id}
                    </span>
                    <span className="text-sm">{step.label}</span>
                  </div>

                  {isActive && <ChevronRight className="w-4 h-4 text-[#EA580C]" />}
                </button>
              );
            })}

            {/* Quick Tips Box */}
            <div className="mt-4 pt-4 border-t border-amber-100 text-xs text-[#5C4740] space-y-1">
              <p className="font-bold text-[#2B120C]">Privacy Guarantee:</p>
              <p>
                Your phone number and contact details are kept strictly private until you explicitly accept alliance requests.
              </p>
            </div>
          </div>

          {/* Right Column: Active Step Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-amber-200/90 p-6 sm:p-8 shadow-sm">
            {activeStep === 1 && (
              <Step1BasicPhysical data={step1Data} onChange={(u) => setStep1Data((p) => ({ ...p, ...u }))} />
            )}
            {activeStep === 2 && (
              <Step2ReligiousSocial data={step2Data} onChange={(u) => setStep2Data((p) => ({ ...p, ...u }))} />
            )}
            {activeStep === 3 && (
              <Step3EducationCareer data={step3Data} onChange={(u) => setStep3Data((p) => ({ ...p, ...u }))} />
            )}
            {activeStep === 4 && (
              <Step4LifestyleHabits data={step4Data} onChange={(u) => setStep4Data((p) => ({ ...p, ...u }))} />
            )}
            {activeStep === 5 && (
              <Step5FamilyBackground data={step5Data} onChange={(u) => setStep5Data((p) => ({ ...p, ...u }))} />
            )}
            {activeStep === 6 && (
              <Step6PhotoBioPrivacy data={step6Data} onChange={(u) => setStep6Data((p) => ({ ...p, ...u }))} />
            )}

            {/* Navigation Action Buttons */}
            <div className="mt-8 pt-6 border-t border-amber-200/70 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={activeStep === 1}
                className="rounded-xl border-amber-200 text-[#3B0A18] h-11 px-4 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Step
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => saveCurrentStep(activeStep, true)}
                  disabled={saving}
                  className="rounded-xl border-amber-300 text-[#3B0A18] h-11 px-4 text-xs font-semibold"
                >
                  <Save className="w-4 h-4 mr-1 text-[#EA580C]" />
                  Save Draft
                </Button>

                {activeStep < 6 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="rounded-xl bg-saffron-gradient text-white h-11 px-6 text-xs font-bold shadow-md hover:opacity-95"
                  >
                    Save &amp; Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinalize}
                    disabled={saving}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 text-xs font-bold shadow-md"
                  >
                    Complete Profile (100%)
                    <CheckCircle2 className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-5 border-t border-amber-200/60 bg-[#FFFDF9] text-center text-xs text-[#8C6D62]">
        <p>© 2026 Vivah Kar Lo. Verified Indian Matrimonial Alliances.</p>
      </footer>
    </div>
  );
}
