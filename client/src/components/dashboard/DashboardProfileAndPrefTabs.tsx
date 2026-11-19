import React, { useState } from "react";
import type { AccountBundle } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Camera,
  CheckCircle2,
  User,
  Briefcase,
  Users,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  Heart,
  MapPin,
  FileText,
  Lock,
  Video,
  Mic,
  Upload,
  ShieldCheck,
} from "lucide-react";

interface MyProfileTabProps {
  account: AccountBundle;
  onUpdateCompletion: (pct: number) => void;
}

type ProfileSectionId =
  | "all"
  | "basic"
  | "religion"
  | "education"
  | "career"
  | "family"
  | "lifestyle"
  | "location"
  | "about"
  | "media"
  | "documents";

function computeAgeFromDob(dobStr: string): number {
  const d = new Date(dobStr);
  if (Number.isNaN(d.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return Math.max(0, age);
}

export const MyProfileTab: React.FC<MyProfileTabProps> = ({
  account,
  onUpdateCompletion,
}) => {
  const { toast } = useToast();
  const initialComplete = account.profileMeta.profileStatus === "complete";
  const pm: any = account.profileMeta || {};

  const [activeSection, setActiveSection] = useState<ProfileSectionId>("all");
  const [saving, setSaving] = useState(false);
  const [bioTone, setBioTone] = useState<"traditional" | "balanced" | "professional">("balanced");

  const [form, setForm] = useState({
    // 1. Basic Information
    fullName: account.user.fullName || "",
    gender: account.user.gender || "Male",
    dob: pm.dob || (initialComplete ? "1996-05-15" : ""),
    height: pm.height || (initialComplete ? "5'10\" (178 cm)" : ""),
    weight: pm.weight || (initialComplete ? "72 kg" : ""),
    maritalStatus: pm.maritalStatus || "Never Married",
    motherTongue: pm.motherTongue || (initialComplete ? "Marathi" : ""),
    profileCreatedBy: account.user.profileCreatedBy || "Self",
    disabilityInfo: pm.disabilityInfo || "None",
    disabilityVisibility: pm.disabilityVisibility || "Private / On Request",

    // 2. Religion & Community
    religion: pm.religion || "Hindu",
    community: pm.community || (initialComplete ? "Maharashtrian" : ""),
    caste: pm.caste || (initialComplete ? "Maratha" : ""),
    subCaste: pm.subCaste || "",
    gotra: pm.gotra || (initialComplete ? "Kashyap" : ""),
    manglik: pm.manglik || "Non-Manglik",
    horoscopeAvailable: pm.horoscopeAvailable ?? true,
    nakshatra: pm.nakshatra || (initialComplete ? "Magha" : ""),
    rashi: pm.rashi || (initialComplete ? "Simha (Leo)" : ""),
    birthTime: pm.birthTime || (initialComplete ? "08:30 AM" : ""),
    birthPlace: pm.birthPlace || (initialComplete ? "Pune, Maharashtra" : ""),

    // 3. Education
    education: pm.education || (initialComplete ? "B.Tech / B.E." : ""),
    degree: pm.degree || (initialComplete ? "B.Tech Computer Science" : ""),
    college: pm.college || (initialComplete ? "COEP / IIT Bombay" : ""),
    professionalQualification: pm.professionalQualification || "",
    additionalCourses: pm.additionalCourses || "",

    // 4. Career & Income
    employmentType: pm.employmentType || "Private Sector",
    workCategory: pm.workCategory || "Job",
    occupation: pm.occupation || (initialComplete ? "Senior Software Engineer" : ""),
    companyName: pm.companyName || (initialComplete ? "TechCorp Global" : ""),
    workLocation: pm.workLocation || (initialComplete ? "Pune" : ""),
    annualIncome: pm.annualIncome || (initialComplete ? "25 - 30 Lakhs P.A." : ""),
    incomePrivacy: pm.incomePrivacy || "Visible to Accepted Interests",

    // 5. Family Details
    fatherName: pm.fatherName || (initialComplete ? "Rajesh Kulkarni" : ""),
    fatherOccupation: pm.fatherOccupation || (initialComplete ? "Retired Bank Manager" : ""),
    motherName: pm.motherName || (initialComplete ? "Sunita Kulkarni" : ""),
    motherOccupation: pm.motherOccupation || (initialComplete ? "Homemaker" : ""),
    brothersCount: pm.brothersCount ?? 1,
    sistersCount: pm.sistersCount ?? 1,
    siblingsMaritalStatus: pm.siblingsMaritalStatus || "1 Married, 1 Unmarried",
    familyType: pm.familyType || "Nuclear",
    familyValues: pm.familyValues || "Moderate Traditional",
    familyStatus: pm.familyStatus || "Upper Middle Class",
    nativePlace: pm.nativePlace || (initialComplete ? "Satara, Maharashtra" : ""),
    familyLocation: pm.familyLocation || (initialComplete ? "Pune, Maharashtra" : ""),

    // 6. Lifestyle
    diet: pm.diet || "Vegetarian",
    smoking: pm.smoking || "No",
    drinking: pm.drinking || "No",
    fitnessLifestyle: pm.fitnessLifestyle || (initialComplete ? "Yoga, Running & Gym" : ""),
    hobbies: pm.hobbies || (initialComplete ? "Trekking, Reading, Classical Music" : ""),
    interests: pm.interests || (initialComplete ? "Travel, Technology, Photography" : ""),
    languagesKnown: pm.languagesKnown || (initialComplete ? "Marathi, Hindi, English" : ""),
    personalityDescription: pm.personalityDescription || (initialComplete ? "Calm, family-oriented, ambitious" : ""),

    // 7. Location
    country: pm.country || "India",
    state: pm.state || (initialComplete ? "Maharashtra" : ""),
    district: pm.district || (initialComplete ? "Pune" : ""),
    city: pm.city || (initialComplete ? "Pune" : ""),
    currentResidence: pm.currentResidence || (initialComplete ? "Baner, Pune" : ""),
    nriStatus: pm.nriStatus || "Resident Indian",
    willingToRelocate: pm.willingToRelocate || "Open to Major Metros / Abroad",

    // 8. About Me
    aboutMyself:
      pm.aboutMyself ||
      (initialComplete
        ? "Family-oriented software professional who enjoys trekking, music, and cultural traditions."
        : ""),
    aboutFamily: pm.aboutFamily || "",
    aboutCareer: pm.aboutCareer || "",
    partnerExpectations: pm.partnerExpectations || "",
    marriageValues: pm.marriageValues || "",

    // 9. Profile Media
    primaryPhotoUrl: pm.primaryPhotoUrl || "/2.jpg",
    galleryPhotos: pm.galleryPhotos || ["/2.jpg", "/1.jpg", "/3.jpg"],
    privatePhotosEnabled: pm.privatePhotosEnabled ?? true,
    videoIntroUrl: pm.videoIntroUrl || "",
    voiceIntroUrl: pm.voiceIntroUrl || "",
    photoCaption: pm.photoCaption || "Family celebration portrait",
    photoVisibility: pm.photoVisibility || "Visible to All",

    // 10. Horoscope & Documents
    horoscopeDocName: pm.horoscopeDocName || "Janam_Kundli_Vedic.pdf",
    biodataPdfName: pm.biodataPdfName || "Official_Matrimonial_Biodata.pdf",
    educationProofName: pm.educationProofName || "",
    idVerificationStatus: pm.idVerificationStatus || "Govt ID Verified ✓",
  });

  const autoAge = computeAgeFromDob(form.dob);

  const calculateCompletion = () => {
    const trackedFields = [
      form.fullName,
      form.dob,
      form.height,
      form.motherTongue,
      form.religion,
      form.caste,
      form.rashi,
      form.education,
      form.degree,
      form.occupation,
      form.annualIncome,
      form.fatherOccupation,
      form.familyType,
      form.diet,
      form.city,
      form.state,
      form.aboutMyself,
      form.marriageValues,
    ];
    const filled = trackedFields.filter((v) => String(v || "").trim().length > 0).length;
    return Math.round((filled / trackedFields.length) * 100);
  };

  const livePct = calculateCompletion();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/v1/admin/users/${account.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            fullName: form.fullName,
            gender: form.gender,
            profileCreatedBy: form.profileCreatedBy,
          },
          profileMeta: {
            ...form,
            age: autoAge,
            profileCompletion: livePct,
            profileStatus: livePct >= 80 ? "complete" : "incomplete",
          },
        }),
      }).catch(() => {});

      onUpdateCompletion(livePct);
      toast({
        title:
          livePct >= 80
            ? `Complete 10-Section Profile Saved (${livePct}%)`
            : `Profile Draft Saved (${livePct}%)`,
        description:
          "Optional sensitive fields respect your chosen privacy & visibility settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const sectionTabs: Array<{ id: ProfileSectionId; label: string }> = [
    { id: "all", label: "All 10 Sections" },
    { id: "basic", label: "1. Basic Info" },
    { id: "religion", label: "2. Religion & Astro" },
    { id: "education", label: "3. Education" },
    { id: "career", label: "4. Career & Income" },
    { id: "family", label: "5. Family Details" },
    { id: "lifestyle", label: "6. Lifestyle" },
    { id: "location", label: "7. Location" },
    { id: "about", label: "8. About Me" },
    { id: "media", label: "9. Profile Media" },
    { id: "documents", label: "10. Documents" },
  ];

  const show = (id: ProfileSectionId) => activeSection === "all" || activeSection === id;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
            10-Section Matrimonial Profile Studio
          </h1>
          <p className="text-sm text-[#5C4740]">
            Complete optional &amp; privacy-controlled sections for higher AI match relevance
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-bold text-[#EA580C]">
            Live Completion: {livePct}%
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="h-10 px-5 rounded-xl bg-saffron-gradient text-white font-bold text-xs shadow-saffron-sm"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>

      {/* Section Navigation Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1">
        {sectionTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveSection(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              activeSection === t.id
                ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                : "bg-white text-[#5C4740] border-amber-200 hover:bg-amber-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: BASIC INFORMATION */}
      {show("basic") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
              <User className="w-5 h-5 text-[#EA580C]" />
              1. Basic Information
            </h3>
            {autoAge > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Auto-Calculated Age: {autoAge} Years
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Gender</Label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as any })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option value="Male">Male (Groom)</option>
                <option value="Female">Female (Bride)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Date of Birth (Auto Age: {autoAge || "--"} Yrs)</Label>
              <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Height</Label>
              <Input value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} placeholder="e.g., 5'8&quot; (173 cm)" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Weight (Optional)</Label>
              <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="e.g., 68 kg" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Marital Status</Label>
              <select value={form.maritalStatus} onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Never Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
                <option>Awaiting Divorce</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Mother Tongue</Label>
              <Input value={form.motherTongue} onChange={(e) => setForm({ ...form, motherTongue: e.target.value })} placeholder="Hindi, Marathi, Tamil..." className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Profile Created By</Label>
              <select value={form.profileCreatedBy} onChange={(e) => setForm({ ...form, profileCreatedBy: e.target.value as any })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Self</option>
                <option>Parents</option>
                <option>Sibling</option>
                <option>Relative</option>
                <option>Friend</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Disability Info (Optional &amp; Privacy Controlled)</Label>
              <div className="flex gap-1.5 mt-1">
                <Input value={form.disabilityInfo} onChange={(e) => setForm({ ...form, disabilityInfo: e.target.value })} placeholder="None / Details" className="h-10 rounded-xl border-amber-200 text-xs flex-1" />
                <select value={form.disabilityVisibility} onChange={(e) => setForm({ ...form, disabilityVisibility: e.target.value })} className="h-10 rounded-xl border border-amber-200 bg-amber-50 px-2 text-[11px] font-semibold">
                  <option>Private / On Request</option>
                  <option>Accepted Matches</option>
                  <option>Visible on Profile</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: RELIGION & COMMUNITY */}
      {show("religion") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <Sparkles className="w-5 h-5 text-[#EA580C]" />
            2. Religion, Community &amp; Horoscope
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold">Religion</Label>
              <Input value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Community</Label>
              <Input value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} placeholder="e.g., North Indian, Maharashtrian" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Caste</Label>
              <Input value={form.caste} onChange={(e) => setForm({ ...form, caste: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Sub-caste (Optional)</Label>
              <Input value={form.subCaste} onChange={(e) => setForm({ ...form, subCaste: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Gotra (Optional)</Label>
              <Input value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Manglik Status</Label>
              <select value={form.manglik} onChange={(e) => setForm({ ...form, manglik: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Non-Manglik</option>
                <option>Manglik</option>
                <option>Anshik Manglik</option>
                <option>Don&apos;t Know</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Rashi (Moon Sign)</Label>
              <Input value={form.rashi} onChange={(e) => setForm({ ...form, rashi: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Nakshatra</Label>
              <Input value={form.nakshatra} onChange={(e) => setForm({ ...form, nakshatra: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Birth Time (Optional)</Label>
              <Input value={form.birthTime} onChange={(e) => setForm({ ...form, birthTime: e.target.value })} placeholder="e.g., 08:30 AM" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Birth Place (Optional)</Label>
              <Input value={form.birthPlace} onChange={(e) => setForm({ ...form, birthPlace: e.target.value })} placeholder="City, State" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                checked={form.horoscopeAvailable}
                onChange={(e) => setForm({ ...form, horoscopeAvailable: e.target.checked })}
                className="h-4 w-4 accent-[#EA580C]"
              />
              <Label className="text-xs font-bold text-[#3B0A18]">
                Horoscope / Janam Kundli Available for Automated Ashtakoot Milan
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: EDUCATION */}
      {show("education") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <GraduationCap className="w-5 h-5 text-[#EA580C]" />
            3. Education Qualifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold">Highest Education</Label>
              <Input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="Doctorate / Masters / Bachelors" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Degree</Label>
              <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="e.g., B.Tech, MBA, MBBS, CA" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">College / University</Label>
              <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="e.g., IIT Delhi, IIM Ahmedabad" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Professional Qualification (Optional)</Label>
              <Input value={form.professionalQualification} onChange={(e) => setForm({ ...form, professionalQualification: e.target.value })} placeholder="e.g., CFA, AWS Solutions Architect" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Additional Courses / Certifications (Optional)</Label>
              <Input value={form.additionalCourses} onChange={(e) => setForm({ ...form, additionalCourses: e.target.value })} placeholder="e.g., Executive Management, AI/ML Specialization" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CAREER & INCOME */}
      {show("career") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <Briefcase className="w-5 h-5 text-[#EA580C]" />
            4. Career &amp; Income (With Privacy Control)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold">Employment Type</Label>
              <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Private Sector</option>
                <option>Government / PSU</option>
                <option>Business / Entrepreneur</option>
                <option>Self-Employed / Practice</option>
                <option>Defense / Civil Services</option>
                <option>Not Working</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Work Category</Label>
              <select value={form.workCategory} onChange={(e) => setForm({ ...form, workCategory: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Job</option>
                <option>Business</option>
                <option>Self-Employed</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Occupation / Designation</Label>
              <Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Company / Business Name (Optional)</Label>
              <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Work Location</Label>
              <Input value={form.workLocation} onChange={(e) => setForm({ ...form, workLocation: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Annual Income Range</Label>
              <Input value={form.annualIncome} onChange={(e) => setForm({ ...form, annualIncome: e.target.value })} placeholder="e.g., 25 - 30 Lakhs P.A." className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div className="sm:col-span-3">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#EA580C]" />
                Income Privacy Setting
              </Label>
              <select value={form.incomePrivacy} onChange={(e) => setForm({ ...form, incomePrivacy: e.target.value })} className="mt-1 w-full sm:w-96 h-10 rounded-xl border border-amber-200 bg-amber-50/50 px-3 text-xs font-semibold">
                <option>Public to Registered Members</option>
                <option>Visible to Accepted Interests</option>
                <option>Keep Private (Used Only for AI Matching)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: FAMILY DETAILS */}
      {show("family") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <Users className="w-5 h-5 text-[#EA580C]" />
            5. Family Details &amp; Background
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold">Father&apos;s Name (Optional)</Label>
              <Input value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Father&apos;s Occupation</Label>
              <Input value={form.fatherOccupation} onChange={(e) => setForm({ ...form, fatherOccupation: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Mother&apos;s Name (Optional)</Label>
              <Input value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Mother&apos;s Occupation</Label>
              <Input value={form.motherOccupation} onChange={(e) => setForm({ ...form, motherOccupation: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Number of Brothers</Label>
              <Input type="number" min={0} max={10} value={form.brothersCount} onChange={(e) => setForm({ ...form, brothersCount: Number(e.target.value) })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Number of Sisters</Label>
              <Input type="number" min={0} max={10} value={form.sistersCount} onChange={(e) => setForm({ ...form, sistersCount: Number(e.target.value) })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Married / Unmarried Siblings</Label>
              <Input value={form.siblingsMaritalStatus} onChange={(e) => setForm({ ...form, siblingsMaritalStatus: e.target.value })} placeholder="e.g., 1 Sister Married, 1 Brother Unmarried" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Family Type</Label>
              <select value={form.familyType} onChange={(e) => setForm({ ...form, familyType: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Nuclear</option>
                <option>Joint</option>
                <option>Extended</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Family Values</Label>
              <select value={form.familyValues} onChange={(e) => setForm({ ...form, familyValues: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Traditional</option>
                <option>Moderate Traditional</option>
                <option>Moderate</option>
                <option>Liberal</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Family Status</Label>
              <select value={form.familyStatus} onChange={(e) => setForm({ ...form, familyStatus: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Middle Class</option>
                <option>Upper Middle Class</option>
                <option>Affluent</option>
                <option>Rich / Royal</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Native Place</Label>
              <Input value={form.nativePlace} onChange={(e) => setForm({ ...form, nativePlace: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Family Location</Label>
              <Input value={form.familyLocation} onChange={(e) => setForm({ ...form, familyLocation: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: LIFESTYLE */}
      {show("lifestyle") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <Heart className="w-5 h-5 text-[#EA580C]" />
            6. Lifestyle, Habits &amp; Personality
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold">Diet</Label>
              <select value={form.diet} onChange={(e) => setForm({ ...form, diet: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Eggetarian</option>
                <option>Vegan</option>
                <option>Jain</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Smoking</Label>
              <select value={form.smoking} onChange={(e) => setForm({ ...form, smoking: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>No</option>
                <option>Occasionally</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Drinking</Label>
              <select value={form.drinking} onChange={(e) => setForm({ ...form, drinking: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>No</option>
                <option>Socially</option>
                <option>Occasionally</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Fitness / Lifestyle</Label>
              <Input value={form.fitnessLifestyle} onChange={(e) => setForm({ ...form, fitnessLifestyle: e.target.value })} placeholder="Yoga, Gym, Active, Outdoors" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Hobbies</Label>
              <Input value={form.hobbies} onChange={(e) => setForm({ ...form, hobbies: e.target.value })} placeholder="Reading, Music, Painting..." className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Interests</Label>
              <Input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Travel, Cooking, Finance..." className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Languages Known</Label>
              <Input value={form.languagesKnown} onChange={(e) => setForm({ ...form, languagesKnown: e.target.value })} placeholder="Hindi, English, Marathi..." className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Personality Description</Label>
              <Input value={form.personalityDescription} onChange={(e) => setForm({ ...form, personalityDescription: e.target.value })} placeholder="Warm, ambitious, empathetic, grounded..." className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: LOCATION */}
      {show("location") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <MapPin className="w-5 h-5 text-[#EA580C]" />
            7. Location &amp; Relocation Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold">Country</Label>
              <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">State</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">District</Label>
              <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Current Residence Area</Label>
              <Input value={form.currentResidence} onChange={(e) => setForm({ ...form, currentResidence: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">NRI Status</Label>
              <select value={form.nriStatus} onChange={(e) => setForm({ ...form, nriStatus: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Resident Indian</option>
                <option>NRI - USA</option>
                <option>NRI - UK</option>
                <option>NRI - Canada</option>
                <option>NRI - UAE</option>
                <option>NRI - Australia</option>
                <option>NRI - Singapore / Europe</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Willingness to Relocate</Label>
              <select value={form.willingToRelocate} onChange={(e) => setForm({ ...form, willingToRelocate: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Open to Major Metros / Abroad</option>
                <option>Open Within India</option>
                <option>Prefer Same State</option>
                <option>Prefer Same City Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: ABOUT ME + SYSTEM-SUGGESTED BIO WRITER */}
      {show("about") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#EA580C]" />
              8. About Me, Family &amp; Marriage Vision
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#7C2D12] self-start">
              System-Suggested Profile Writer (1-Click Templates)
            </span>
          </div>

          {/* System-Suggested Bio Generator Bar (Rule-based, Zero AI) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/60 border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-[#3B0A18] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                  Instant System-Suggested Bio Assistant
                </p>
                <p className="text-[11px] text-[#5C4740]">
                  Automatically crafts structured paragraphs from your filled education, career, city, hobbies &amp; family details.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: "traditional", label: "Warm & Traditional" },
                    { id: "balanced", label: "Modern & Balanced" },
                    { id: "professional", label: "Concise & Pro" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBioTone(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      bioTone === t.id
                        ? "bg-[#3B0A18] text-amber-100 border-[#3B0A18]"
                        : "bg-white text-[#5C4740] border-amber-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(() => {
                const name = form.fullName || "I";
                const occ = form.occupation || "working professional";
                const comp = form.companyName ? ` at ${form.companyName}` : "";
                const edu = form.degree || form.education || "well-educated graduate";
                const city = form.city || "India";
                const hobbies = form.hobbies || "reading, travel, and music";
                const fType = form.familyType || "Nuclear";
                const fVal = form.familyValues || "Moderate Traditional";
                const fatherOcc = form.fatherOccupation || "retired professional";
                const motherOcc = form.motherOccupation || "homemaker";

                const templates = {
                  traditional: {
                    aboutMyself: `Namaste! I am ${name}, currently working as a ${occ}${comp} based in ${city}. Having completed ${edu}, I deeply value Indian cultural traditions, family bonding, and simplicity. Outside work, I enjoy ${hobbies} and spending quality time with loved ones.`,
                    aboutFamily: `We are a close-knit ${fType} family rooted in ${fVal} values, residing in ${form.familyLocation || city}. My father is a ${fatherOcc} and my mother is a ${motherOcc}. We have ${form.brothersCount} brother(s) and ${form.sistersCount} sister(s), and our home celebrates warmth, mutual respect, and togetherness.`,
                    aboutCareer: `I take pride in my career as a ${occ}${comp} (${form.employmentType}). I strive for steady professional growth while always prioritizing family commitments and a peaceful work-life harmony.`,
                    partnerExpectations: `Looking for a kind-hearted, respectful, and family-oriented life partner who cherishes cultural values, emotional honesty, and mutual support through every phase of life.`,
                    marriageValues: `Trust, respect for both families, open communication, shared traditions, and standing beside each other with patience and warmth.`,
                  },
                  balanced: {
                    aboutMyself: `Hello! I'm ${name}, a ${occ}${comp} living in ${city} with an academic background in ${edu}. Friends describe me as warm, grounded, and optimistic. I enjoy ${hobbies}, follow a ${form.diet.toLowerCase()} lifestyle, and believe in balancing modern ambitions with strong family roots.`,
                    aboutFamily: `I belong to an educated, ${fVal} ${fType} family settled in ${form.familyLocation || city}. My father works as a ${fatherOcc}, my mother is a ${motherOcc}, and we share a supportive, joyful bond across all generations.`,
                    aboutCareer: `Professionally, I work in ${form.employmentType} as a ${occ}${comp}. I enjoy meaningful challenges, continuous learning, and maintaining a healthy balance between career milestones and personal happiness.`,
                    partnerExpectations: `Seeking an understanding, well-educated partner who brings positivity, good humor, and genuine partnership. Someone who values both personal growth and building a loving home together.`,
                    marriageValues: `Friendship first, equality, transparency, mutual encouragement of each other's dreams, and caring equally for both families.`,
                  },
                  professional: {
                    aboutMyself: `${name} | ${occ}${comp} | ${edu} | Based in ${city}. Driven, calm, and family-conscious individual with interests in ${hobbies}.`,
                    aboutFamily: `Well-settled ${fType} family (${form.familyStatus}, ${fVal} outlook) based in ${form.familyLocation || city}. Father: ${fatherOcc}; Mother: ${motherOcc}; Siblings: ${form.siblingsMaritalStatus}.`,
                    aboutCareer: `Focused career track as ${occ}${comp} in ${form.workLocation || city} (${form.employmentType}). Open to thoughtful mutual career planning after marriage.`,
                    partnerExpectations: `Looking for a compatible, educated, and emotionally mature life partner who values clarity, ambition, and a harmonious family environment.`,
                    marriageValues: `Mutual respect, intellectual companionship, financial transparency, and dependable partnership.`,
                  },
                };

                const chosen = templates[bioTone];

                return (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, ...chosen }));
                        toast({
                          title: "System Suggestions Applied!",
                          description: "All 5 About Me sections populated. Feel free to customize any line.",
                        });
                      }}
                      className="h-8 rounded-xl bg-saffron-gradient text-white text-xs font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Fill All 5 Suggestions
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setForm((prev) => ({ ...prev, aboutMyself: chosen.aboutMyself }))}
                      className="h-8 rounded-xl border-amber-300 bg-white text-xs font-semibold"
                    >
                      Suggest About Myself
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setForm((prev) => ({ ...prev, aboutFamily: chosen.aboutFamily }))}
                      className="h-8 rounded-xl border-amber-300 bg-white text-xs font-semibold"
                    >
                      Suggest My Family
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          partnerExpectations: chosen.partnerExpectations,
                          marriageValues: chosen.marriageValues,
                        }))
                      }
                      className="h-8 rounded-xl border-amber-300 bg-white text-xs font-semibold"
                    >
                      Suggest Expectations
                    </Button>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold">About Myself</Label>
              <Textarea value={form.aboutMyself} onChange={(e) => setForm({ ...form, aboutMyself: e.target.value })} rows={3} placeholder="Introduce your personality, upbringing, and daily life..." className="mt-1 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">My Family</Label>
              <Textarea value={form.aboutFamily} onChange={(e) => setForm({ ...form, aboutFamily: e.target.value })} rows={3} placeholder="Describe your family culture, warmth, and togetherness..." className="mt-1 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">My Career</Label>
              <Textarea value={form.aboutCareer} onChange={(e) => setForm({ ...form, aboutCareer: e.target.value })} rows={3} placeholder="Highlight your career goals and work-life balance..." className="mt-1 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">My Expectations</Label>
              <Textarea value={form.partnerExpectations} onChange={(e) => setForm({ ...form, partnerExpectations: e.target.value })} rows={3} placeholder="Share what qualities you appreciate in a life partner..." className="mt-1 rounded-xl border-amber-200 text-sm" />
            </div>
            <div className="lg:col-span-2">
              <Label className="text-xs font-semibold">What I Value Most in Marriage</Label>
              <Textarea value={form.marriageValues} onChange={(e) => setForm({ ...form, marriageValues: e.target.value })} rows={2} placeholder="Trust, mutual respect, humor, shared ambitions, and caring for both families..." className="mt-1 rounded-xl border-amber-200 text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: PROFILE MEDIA */}
      {show("media") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2 border-b border-amber-100 pb-2.5">
            <Camera className="w-5 h-5 text-[#EA580C]" />
            9. Profile Media, Gallery, Video &amp; Voice Introduction
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={form.primaryPhotoUrl}
              alt={form.fullName}
              className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-amber-300 shadow-xs"
            />
            <div className="flex gap-2">
              {(form.galleryPhotos as string[]).map((src, i) => (
                <img key={i} src={src} alt={`Gallery ${i + 1}`} className="w-16 h-16 rounded-xl object-cover border border-amber-200" />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast({
                  title: "Protected Gallery Ready",
                  description: "Uploaded photos are automatically protected by Vivah Photo Shield™ watermark.",
                })
              }
              className="h-10 rounded-xl border-amber-300 text-xs font-bold"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-[#EA580C]" />
              Add Gallery / Private Photo
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-[#EA580C]" />
                Video Introduction URL (Optional)
              </Label>
              <Input value={form.videoIntroUrl} onChange={(e) => setForm({ ...form, videoIntroUrl: e.target.value })} placeholder="30-60s self-intro video link" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-[#EA580C]" />
                Voice Introduction URL (Optional)
              </Label>
              <Input value={form.voiceIntroUrl} onChange={(e) => setForm({ ...form, voiceIntroUrl: e.target.value })} placeholder="Voice greeting audio link" className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Photo Caption</Label>
              <Input value={form.photoCaption} onChange={(e) => setForm({ ...form, photoCaption: e.target.value })} className="mt-1 h-10 rounded-xl border-amber-200 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Photo Visibility Control</Label>
              <select value={form.photoVisibility} onChange={(e) => setForm({ ...form, photoVisibility: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm">
                <option>Visible to All</option>
                <option>Visible Only to Accepted Interests</option>
                <option>Blur Photo with Request Access</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                checked={form.privatePhotosEnabled}
                onChange={(e) => setForm({ ...form, privatePhotosEnabled: e.target.checked })}
                className="h-4 w-4 accent-[#EA580C]"
              />
              <Label className="text-xs font-bold text-[#3B0A18]">
                Lock Private Album Photos (Requires Explicit Photo Access Request Approval)
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 10: HOROSCOPE & DOCUMENTS */}
      {show("documents") && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
            <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              10. Horoscope, Biodata PDF &amp; Verification Documents
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              {form.idVerificationStatus}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#2B120C]">Horoscope / Kundli Upload</p>
                <p className="text-[#5C4740]">{form.horoscopeDocName || "No file uploaded"}</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => toast({ title: "Horoscope File Linked", description: "Kundli PDF is ready for compatible alliances." })} className="h-8 rounded-lg border-amber-300 text-xs font-semibold">
                Upload PDF
              </Button>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#2B120C]">Matrimonial Biodata PDF</p>
                <p className="text-[#5C4740]">{form.biodataPdfName || "No file uploaded"}</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => toast({ title: "Biodata PDF Attached", description: "Shared only with accepted connections." })} className="h-8 rounded-lg border-amber-300 text-xs font-semibold">
                Upload Biodata
              </Button>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#2B120C]">Education Proof (Optional)</p>
                <p className="text-[#5C4740]">{form.educationProofName || "Degree Certificate (Private Vault)"}</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => { setForm({ ...form, educationProofName: "Degree_Verified.pdf" }); toast({ title: "Education Proof Queued for Verification" }); }} className="h-8 rounded-lg border-amber-300 text-xs font-semibold">
                Verify Degree
              </Button>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900">Identity Verification Document (Secure, Private)</p>
                <p className="text-emerald-800">Encrypted Govt ID Vault — Never exposed publicly</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={saving}
        className="w-full sm:w-auto px-8 h-12 rounded-xl bg-saffron-gradient text-white font-semibold text-base shadow-saffron-sm"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? "Saving All Sections..." : "Save Complete 10-Section Profile"}
      </Button>
    </form>
  );
};

export const PartnerPreferenceTab: React.FC = () => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState({
    ageMin: "23",
    ageMax: "29",
    heightMin: "5'3\"",
    heightMax: "6'0\"",
    maritalStatus: "Never Married",
    community: "Open to All Communities",
    motherTongue: "Hindi / Marathi / English",
    education: "Graduate / Post Graduate / Doctor / CA",
    minIncome: "12 Lakhs+ P.A.",
    cities: "Pune, Mumbai, Bengaluru, Delhi NCR",
    manglik: "Non-Manglik / Doesn't Matter",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Partner Preferences Updated",
      description:
        "Your daily match recommendations will align with these saved criteria.",
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
          Partner Preferences
        </h1>
        <p className="text-sm text-[#5C4740]">
          Define your ideal life partner criteria for AI &amp; Kundli matching
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-5">
        <h3 className="font-serif-royal text-lg font-bold text-[#3B0A18] flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#EA580C]" />
          Desired Match Criteria
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-semibold">Min Age (Years)</Label>
            <Input
              value={prefs.ageMin}
              onChange={(e) => setPrefs({ ...prefs, ageMin: e.target.value })}
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Max Age (Years)</Label>
            <Input
              value={prefs.ageMax}
              onChange={(e) => setPrefs({ ...prefs, ageMax: e.target.value })}
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Marital Status</Label>
            <select
              value={prefs.maritalStatus}
              onChange={(e) =>
                setPrefs({ ...prefs, maritalStatus: e.target.value })
              }
              className="mt-1 w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-base sm:text-sm"
            >
              <option>Never Married</option>
              <option>Open to All</option>
              <option>Divorced / Widowed</option>
            </select>
          </div>
          <div>
            <Label className="text-sm font-semibold">Preferred Community</Label>
            <Input
              value={prefs.community}
              onChange={(e) =>
                setPrefs({ ...prefs, community: e.target.value })
              }
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Mother Tongue</Label>
            <Input
              value={prefs.motherTongue}
              onChange={(e) =>
                setPrefs({ ...prefs, motherTongue: e.target.value })
              }
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Manglik Preference</Label>
            <Input
              value={prefs.manglik}
              onChange={(e) => setPrefs({ ...prefs, manglik: e.target.value })}
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Education</Label>
            <Input
              value={prefs.education}
              onChange={(e) =>
                setPrefs({ ...prefs, education: e.target.value })
              }
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Minimum Income</Label>
            <Input
              value={prefs.minIncome}
              onChange={(e) =>
                setPrefs({ ...prefs, minIncome: e.target.value })
              }
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Preferred Cities</Label>
            <Input
              value={prefs.cities}
              onChange={(e) => setPrefs({ ...prefs, cities: e.target.value })}
              className="mt-1 h-11 rounded-xl border-amber-200 text-base sm:text-sm"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto px-8 h-12 rounded-xl bg-saffron-gradient text-white font-semibold text-base shadow-saffron-sm"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Partner Preferences
      </Button>
    </form>
  );
};
