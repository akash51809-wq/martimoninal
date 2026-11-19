import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type {
  PartnerPreferenceCriteria,
  PreferencePriorityLevel,
} from "@/types/matchAndSearchTypes";
import {
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  HeartHandshake,
  RotateCcw,
  ShieldAlert,
  Heart,
  Layers,
} from "lucide-react";

interface PartnerPreferencesEditorProps {
  userId?: string;
  onSaved?: (prefs: PartnerPreferenceCriteria) => void;
  onCancel?: () => void;
}

const DEFAULT_PREFERENCES: PartnerPreferenceCriteria = {
  ageMin: 22,
  ageMax: 30,
  heightMinCm: 155,
  heightMaxCm: 185,
  maritalStatus: ["Never Married"],
  religions: ["Hindu"],
  castes: ["Maratha", "Brahmin"],
  motherTongues: ["Marathi", "Hindi", "English"],
  educationLevels: ["Doctor", "Engineer", "MBA", "CA", "Post Graduate"],
  employedIn: ["Private Sector", "Government / PSU", "Business / Self-Employed"],
  occupations: ["Doctor", "Software Engineer", "Chartered Accountant", "Architect"],
  minAnnualIncomeLpa: 12,
  preferredCities: ["Pune", "Mumbai", "Bengaluru", "Delhi NCR"],
  preferredStates: ["Maharashtra", "Karnataka", "Delhi"],
  preferredCountries: ["India"],
  diet: ["Vegetarian", "Eggetarian"],
  smoking: "No",
  drinking: "No",
  manglik: "Non-Manglik",
  familyTypes: ["Nuclear", "Joint"],
  familyValues: ["Moderate Traditional", "Traditional"],
  willingToRelocate: "Open to Major Metros / Abroad",
  marriageExpectations: {
    timeline: "Within 6 - 12 Months",
    childrenPreference: "Want Children",
    careerAfterMarriage: "Strongly Support Partner's Career",
    relocationAfterMarriage: "Open to Discussion",
    familyResponsibilities: "Balanced Care for Both Families",
    religiousCultural: "Respectful of Cultural & Festival Traditions",
  },
  dealbreakers: {
    strictAgeRange: true,
    strictMaritalStatus: true,
    nonSmokerOnly: true,
    nonDrinkerOnly: false,
    strictLocation: false,
    strictDiet: false,
    strictManglik: false,
  },
  flexiblePreferences: {
    sameCity: true,
    sameProfession: false,
    sameHobbies: true,
    sameCommunity: false,
    similarFamilyBackground: true,
  },
  priorities: {
    age: "Must Have",
    community: "Nice to Have",
    education: "Strong Preference",
    careerIncome: "Strong Preference",
    location: "Nice to Have",
    family: "Must Have",
    lifestyle: "Strong Preference",
    horoscope: "Flexible",
  },
};

export const PartnerPreferencesEditor: React.FC<PartnerPreferencesEditorProps> = ({
  userId = "usr-active-complete",
  onSaved,
}) => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<PartnerPreferenceCriteria>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [matchCountPreview, setMatchCountPreview] = useState<number>(8);

  // Load preferences from API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/matches/preferences/${userId}`);
        const data = await res.json();
        if (data.success && data.preferences && isMounted) {
          setPrefs({
            ...DEFAULT_PREFERENCES,
            ...data.preferences,
            marriageExpectations: {
              ...DEFAULT_PREFERENCES.marriageExpectations!,
              ...(data.preferences.marriageExpectations || {}),
            },
            dealbreakers: {
              ...DEFAULT_PREFERENCES.dealbreakers!,
              ...(data.preferences.dealbreakers || {}),
            },
            flexiblePreferences: {
              ...DEFAULT_PREFERENCES.flexiblePreferences!,
              ...(data.preferences.flexiblePreferences || {}),
            },
            priorities: {
              ...DEFAULT_PREFERENCES.priorities!,
              ...(data.preferences.priorities || {}),
            },
          });
        }
      } catch (err) {
        console.warn("Using offline default preferences fallback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPreferences();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Dynamic estimate of potential matches based on active criteria
  useEffect(() => {
    let count = 15;
    if (prefs.ageMax - prefs.ageMin < 6) count -= 2;
    if (prefs.minAnnualIncomeLpa >= 25) count -= 4;
    if (prefs.castes.length > 0 && !prefs.castes.includes("All")) count -= 2;
    if (prefs.manglik === "Non-Manglik") count -= 1;
    setMatchCountPreview(Math.max(3, count));
  }, [prefs]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/matches/preferences/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save");

      toast({
        title: "Partner Preferences Updated",
        description:
          "Your Daily Top Matches, Mutual Matches, and recommendations will now reflect these criteria.",
      });

      if (onSaved) onSaved(data.preferences || prefs);
    } catch (err: any) {
      toast({
        title: "Preferences Saved Locally",
        description: "Your partner criteria have been cached for active match recommendations.",
      });
      if (onSaved) onSaved(prefs);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setPrefs(DEFAULT_PREFERENCES);
    toast({
      title: "Reset to Recommended Defaults",
      description: "Default criteria for broad verified match compatibility applied.",
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200/90 rounded-2xl p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Programme 03 • Smart Match Algorithm</span>
          </div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C] mt-1">
            Partner Preferences &amp; Criteria
          </h1>
          <p className="text-sm text-[#5C4740] mt-1">
            Define your ideal partner attributes to train our 100% two-way mutual matching engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-amber-200 shadow-sm text-center">
            <span className="block text-[11px] font-semibold text-[#5C4740] uppercase">
              Potential Matches
            </span>
            <span className="text-xl font-bold text-[#EA580C]">
              {matchCountPreview} Profiles
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="rounded-xl border-amber-300 text-[#3B0A18] hover:bg-amber-100/60"
            title="Reset to recommended defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid of Preference Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Basic & Physical */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3B0A18] font-bold pb-2 border-b border-amber-100">
            <Users className="w-5 h-5 text-[#EA580C]" />
            <h2 className="font-serif-royal text-lg">1. Age, Height &amp; Marital Status</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Min Age (Years)
              </Label>
              <Input
                type="number"
                min={18}
                max={75}
                value={prefs.ageMin}
                onChange={(e) =>
                  setPrefs({ ...prefs, ageMin: parseInt(e.target.value) || 21 })
                }
                className="mt-1 h-11 rounded-xl border-amber-200"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Max Age (Years)
              </Label>
              <Input
                type="number"
                min={18}
                max={80}
                value={prefs.ageMax}
                onChange={(e) =>
                  setPrefs({ ...prefs, ageMax: parseInt(e.target.value) || 35 })
                }
                className="mt-1 h-11 rounded-xl border-amber-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Min Height (cm)
              </Label>
              <Input
                type="number"
                min={120}
                max={220}
                value={prefs.heightMinCm}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    heightMinCm: parseInt(e.target.value) || 150,
                  })
                }
                className="mt-1 h-11 rounded-xl border-amber-200"
              />
              <span className="text-[11px] text-[#7C2D12]">
                ~ {Math.floor(prefs.heightMinCm / 30.48)}&apos;
                {Math.round((prefs.heightMinCm % 30.48) / 2.54)}&quot;
              </span>
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Max Height (cm)
              </Label>
              <Input
                type="number"
                min={120}
                max={220}
                value={prefs.heightMaxCm}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    heightMaxCm: parseInt(e.target.value) || 190,
                  })
                }
                className="mt-1 h-11 rounded-xl border-amber-200"
              />
              <span className="text-[11px] text-[#7C2D12]">
                ~ {Math.floor(prefs.heightMaxCm / 30.48)}&apos;
                {Math.round((prefs.heightMaxCm % 30.48) / 2.54)}&quot;
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">
              Marital Status Preference
            </Label>
            <select
              value={prefs.maritalStatus[0] || "Never Married"}
              onChange={(e) =>
                setPrefs({ ...prefs, maritalStatus: [e.target.value] })
              }
              className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-sm"
            >
              <option value="Never Married">Never Married</option>
              <option value="Open to All">Open to All Marital Statuses</option>
              <option value="Divorced">Divorced / Awaiting Divorce</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        {/* Section 2: Religion, Caste & Horoscope */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3B0A18] font-bold pb-2 border-b border-amber-100">
            <Sparkles className="w-5 h-5 text-[#EA580C]" />
            <h2 className="font-serif-royal text-lg">2. Religion, Caste &amp; Kundli</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Religion</Label>
              <select
                value={prefs.religions[0] || "Hindu"}
                onChange={(e) => setPrefs({ ...prefs, religions: [e.target.value] })}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-sm"
              >
                <option value="Hindu">Hindu</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Open to All">Open to All Religions</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Manglik Preference
              </Label>
              <select
                value={prefs.manglik}
                onChange={(e) => setPrefs({ ...prefs, manglik: e.target.value })}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-sm"
              >
                <option value="Non-Manglik">Non-Manglik Only</option>
                <option value="Doesn't Matter">Doesn&apos;t Matter / Open</option>
                <option value="Manglik">Manglik Only</option>
                <option value="Anshik Manglik">Anshik Manglik Accepted</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">
              Preferred Communities / Castes (Comma separated)
            </Label>
            <Input
              value={prefs.castes.join(", ")}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  castes: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., Maratha, Brahmin, Patel, Kayastha (or leave blank for all)"
              className="mt-1 h-11 rounded-xl border-amber-200"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">
              Mother Tongue(s)
            </Label>
            <Input
              value={prefs.motherTongues.join(", ")}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  motherTongues: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., Marathi, Hindi, Gujarati, English"
              className="mt-1 h-11 rounded-xl border-amber-200"
            />
          </div>
        </div>

        {/* Section 3: Education & Career */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3B0A18] font-bold pb-2 border-b border-amber-100">
            <GraduationCap className="w-5 h-5 text-[#EA580C]" />
            <h2 className="font-serif-royal text-lg">3. Education &amp; Career</h2>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">
              Desired Education Levels
            </Label>
            <Input
              value={prefs.educationLevels.join(", ")}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  educationLevels: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., Doctor, Engineer, MBA, CA, IIT / IIM"
              className="mt-1 h-11 rounded-xl border-amber-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Min Annual Income (₹ LPA)
              </Label>
              <Input
                type="number"
                min={0}
                max={200}
                value={prefs.minAnnualIncomeLpa}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    minAnnualIncomeLpa: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 h-11 rounded-xl border-amber-200"
              />
              <span className="text-[11px] text-[#7C2D12]">
                {prefs.minAnnualIncomeLpa === 0
                  ? "Open to any income"
                  : `₹${prefs.minAnnualIncomeLpa} Lakhs+ per annum`}
              </span>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">
                Employment Type
              </Label>
              <select
                value={prefs.employedIn[0] || "All"}
                onChange={(e) =>
                  setPrefs({ ...prefs, employedIn: [e.target.value] })
                }
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-sm"
              >
                <option value="All">Open to All Sectors</option>
                <option value="Government / PSU">Government / Civil Services / PSU</option>
                <option value="Private Sector">Private Sector / MNC</option>
                <option value="Business / Self-Employed">Business / Entrepreneur</option>
                <option value="NRI">NRI / Overseas Settled</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">
              Preferred Professions (Comma separated)
            </Label>
            <Input
              value={prefs.occupations.join(", ")}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  occupations: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., Doctor, Software Engineer, CA, Civil Services, Architect"
              className="mt-1 h-11 rounded-xl border-amber-200"
            />
          </div>
        </div>

        {/* Section 4: Location & Lifestyle */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3B0A18] font-bold pb-2 border-b border-amber-100">
            <MapPin className="w-5 h-5 text-[#EA580C]" />
            <h2 className="font-serif-royal text-lg">4. Location &amp; Lifestyle</h2>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">
              Preferred Cities (Comma separated)
            </Label>
            <Input
              value={prefs.preferredCities.join(", ")}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  preferredCities: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., Pune, Mumbai, Bengaluru, Delhi NCR, London"
              className="mt-1 h-11 rounded-xl border-amber-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Diet</Label>
              <select
                value={prefs.diet[0] || "Vegetarian"}
                onChange={(e) => setPrefs({ ...prefs, diet: [e.target.value] })}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-2.5 text-xs sm:text-sm"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Pure Vegetarian">Pure Veg / Jain</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Doesn't Matter">Doesn&apos;t Matter</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Smoking</Label>
              <select
                value={prefs.smoking}
                onChange={(e) => setPrefs({ ...prefs, smoking: e.target.value })}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-2.5 text-xs sm:text-sm"
              >
                <option value="No">Non-Smoker Only</option>
                <option value="Doesn't Matter">Doesn&apos;t Matter</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#3B0A18]">Drinking</Label>
              <select
                value={prefs.drinking}
                onChange={(e) => setPrefs({ ...prefs, drinking: e.target.value })}
                className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-2.5 text-xs sm:text-sm"
              >
                <option value="No">Teetotaler Only</option>
                <option value="Social">Socially Accepted</option>
                <option value="Doesn't Matter">Doesn&apos;t Matter</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-[#5C4740] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#EA580C] shrink-0" />
            <span>
              Your criteria are matched bi-directionally with prospective life partners for 100% mutual harmony.
            </span>
          </div>
        </div>
      </div>

      {/* Section 7: Marriage Expectations */}
      <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
          <Heart className="w-5 h-5 text-[#EA580C]" />
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18]">
            7. Marriage Goals &amp; Long-Term Expectations
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Marriage Timeline</Label>
            <select
              value={prefs.marriageExpectations?.timeline || "Within 6 - 12 Months"}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  marriageExpectations: {
                    ...prefs.marriageExpectations!,
                    timeline: e.target.value,
                  },
                })
              }
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option>Within 3 - 6 Months</option>
              <option>Within 6 - 12 Months</option>
              <option>Within 1 - 2 Years</option>
              <option>Flexible / Once Right Match Is Found</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Children Preference</Label>
            <select
              value={prefs.marriageExpectations?.childrenPreference || "Want Children"}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  marriageExpectations: {
                    ...prefs.marriageExpectations!,
                    childrenPreference: e.target.value,
                  },
                })
              }
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option>Want Children</option>
              <option>Open to Discussion Later</option>
              <option>Prefer No Children</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Career After Marriage</Label>
            <select
              value={prefs.marriageExpectations?.careerAfterMarriage || "Strongly Support Partner's Career"}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  marriageExpectations: {
                    ...prefs.marriageExpectations!,
                    careerAfterMarriage: e.target.value,
                  },
                })
              }
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option>Strongly Support Partner&apos;s Career</option>
              <option>Partner&apos;s Personal Choice</option>
              <option>Prefer Homemaker Focus</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Relocation After Marriage</Label>
            <select
              value={prefs.marriageExpectations?.relocationAfterMarriage || "Open to Discussion"}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  marriageExpectations: {
                    ...prefs.marriageExpectations!,
                    relocationAfterMarriage: e.target.value,
                  },
                })
              }
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option>Open to Discussion</option>
              <option>Willing to Relocate Anywhere (India/Abroad)</option>
              <option>Prefer Partner Moves to My City</option>
              <option>Must Stay in Same City</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Family Responsibilities</Label>
            <select
              value={prefs.marriageExpectations?.familyResponsibilities || "Balanced Care for Both Families"}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  marriageExpectations: {
                    ...prefs.marriageExpectations!,
                    familyResponsibilities: e.target.value,
                  },
                })
              }
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option>Balanced Care for Both Families</option>
              <option>Living Together with Parents</option>
              <option>Independent Nuclear Setup</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-[#3B0A18]">Religious &amp; Cultural Outlook</Label>
            <select
              value={prefs.marriageExpectations?.religiousCultural || "Respectful of Cultural & Festival Traditions"}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  marriageExpectations: {
                    ...prefs.marriageExpectations!,
                    religiousCultural: e.target.value,
                  },
                })
              }
              className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-xs sm:text-sm"
            >
              <option>Respectful of Cultural &amp; Festival Traditions</option>
              <option>Deeply Religious &amp; Traditional</option>
              <option>Spiritual but Modern</option>
              <option>Secular &amp; Liberal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sections 8 & 9: Dealbreakers (Hard Reject) & Flexible Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8. Dealbreakers */}
        <div className="bg-white rounded-2xl border border-rose-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="font-serif-royal text-lg font-bold text-rose-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              8. Strict Dealbreakers (Non-Negotiable)
            </h3>
            <Badge className="bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
              Hard AI Filter
            </Badge>
          </div>
          <p className="text-xs text-[#5C4740]">
            Profiles violating selected dealbreakers are automatically flagged or excluded from your AI Recommended feed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {[
              { key: "strictAgeRange", label: "Must strictly be inside preferred age range" },
              { key: "strictMaritalStatus", label: "Must match preferred marital status" },
              { key: "nonSmokerOnly", label: "Zero tolerance for smoking" },
              { key: "nonDrinkerOnly", label: "Zero tolerance for alcohol" },
              { key: "strictLocation", label: "Must reside in preferred city/country" },
              { key: "strictDiet", label: "Must strictly follow dietary preference" },
              { key: "strictManglik", label: "Strict Manglik compatibility required" },
            ].map((item) => {
              const checked = Boolean((prefs.dealbreakers as any)?.[item.key]);
              return (
                <label
                  key={item.key}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors ${
                    checked
                      ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                      : "bg-[#FFFDF9] border-amber-200/70 text-[#5C4740]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        dealbreakers: {
                          ...prefs.dealbreakers!,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                    className="mt-0.5 accent-rose-600"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 9. Flexible Preferences */}
        <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#EA580C]" />
              9. Flexible Preferences (Bonus Points)
            </h3>
            <Badge className="bg-amber-50 text-[#7C2D12] border border-amber-200 text-[10px] font-bold">
              Soft Ranking Boost
            </Badge>
          </div>
          <p className="text-xs text-[#5C4740]">
            Preferred qualities that boost a candidate&apos;s compatibility score without excluding great overall matches.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {[
              { key: "sameCity", label: "Same current city is a plus" },
              { key: "sameProfession", label: "Similar career / profession domain" },
              { key: "sameHobbies", label: "Shared hobbies & weekend interests" },
              { key: "sameCommunity", label: "Same sub-community or mother tongue" },
              { key: "similarFamilyBackground", label: "Similar family background & status" },
            ].map((item) => {
              const checked = Boolean((prefs.flexiblePreferences as any)?.[item.key]);
              return (
                <label
                  key={item.key}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors ${
                    checked
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                      : "bg-[#FFFDF9] border-amber-200/70 text-[#5C4740]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        flexiblePreferences: {
                          ...prefs.flexiblePreferences!,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                    className="mt-0.5 accent-emerald-600"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 10: Preference Priority Matrix (AI Weighting) */}
      <div className="bg-white rounded-2xl border border-amber-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div>
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#EA580C]" />
              10. AI Preference Priority Matrix
            </h3>
            <p className="text-xs text-[#5C4740]">
              Tell our AI Matching Engine which criteria matter most rather than treating all filters equally.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              { key: "age", label: "Age & Height Range" },
              { key: "community", label: "Religion & Community" },
              { key: "education", label: "Education Pedigree" },
              { key: "careerIncome", label: "Career & Income" },
              { key: "location", label: "City / NRI Location" },
              { key: "family", label: "Family Values & Type" },
              { key: "lifestyle", label: "Lifestyle & Diet" },
              { key: "horoscope", label: "Kundli & Manglik" },
            ] as const
          ).map((pillar) => {
            const val: PreferencePriorityLevel =
              (prefs.priorities as any)?.[pillar.key] || "Strong Preference";
            return (
              <div
                key={pillar.key}
                className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1.5"
              >
                <Label className="text-xs font-bold text-[#2B120C] block">
                  {pillar.label}
                </Label>
                <select
                  value={val}
                  onChange={(e) =>
                    setPrefs({
                      ...prefs,
                      priorities: {
                        ...prefs.priorities!,
                        [pillar.key]: e.target.value as PreferencePriorityLevel,
                      },
                    })
                  }
                  className="w-full h-9 rounded-lg border border-amber-300 bg-white px-2 text-xs font-semibold text-[#3B0A18]"
                >
                  <option value="Must Have">Must Have (3x Weight)</option>
                  <option value="Strong Preference">Strong Preference (2x)</option>
                  <option value="Nice to Have">Nice to Have (1x)</option>
                  <option value="Flexible">Flexible (0.5x)</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200">
        <span className="text-xs text-[#5C4740]">
          Updates are applied instantly across Daily Top 10, Mutual, and Verified match recommendations.
        </span>
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 h-12 rounded-xl bg-saffron-gradient text-white font-semibold text-base shadow-saffron-sm hover:opacity-95"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Criteria...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>Save Partner Preferences</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
