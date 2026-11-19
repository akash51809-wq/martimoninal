import React, { useEffect, useState } from "react";
import type { AccountBundle, AccountStatus } from "@/types/authTypes";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Sparkles,
  GraduationCap,
  Users,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Crown,
  AlertTriangle,
  Pencil,
  Save,
  X,
  MapPin,
  FileText,
} from "lucide-react";

interface AdminUserDossierModalProps {
  account: AccountBundle | null;
  open: boolean;
  initialEditMode?: boolean;
  onOpenChange: (open: boolean) => void;
  onActivate: (id: string) => void;
  onSuspend: (id: string) => void;
  onMakeVip: (id: string) => void;
  onSaveUser?: (
    userId: string,
    updates: { user?: Partial<AccountBundle["user"]>; profileMeta?: Record<string, any> }
  ) => void;
}

type DossierTab =
  | "all_tables"
  | "basic"
  | "religion"
  | "career"
  | "family"
  | "lifestyle"
  | "media";

export const AdminUserDossierModal: React.FC<AdminUserDossierModalProps> = ({
  account,
  open,
  initialEditMode = false,
  onOpenChange,
  onActivate,
  onSuspend,
  onMakeVip,
  onSaveUser,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<DossierTab>("all_tables");
  const [isEditing, setIsEditing] = useState<boolean>(initialEditMode);
  const [draftUser, setDraftUser] = useState<Record<string, any>>({});
  const [draftProfile, setDraftProfile] = useState<Record<string, any>>({});

  useEffect(() => {
    if (account) {
      setDraftUser({
        fullName: account.user.fullName || "",
        email: account.user.email || "",
        mobile: account.user.mobile || "",
        gender: account.user.gender || "Male",
        accountStatus: account.user.accountStatus || "active",
        profileCreatedBy: account.user.profileCreatedBy || "Self",
      });
      const pm: any = account.profileMeta || {};
      setDraftProfile({
        primaryPhotoUrl: pm.primaryPhotoUrl || "/2.jpg",
        dob: pm.dob || "1996-05-15",
        height: pm.height || "5'9\" (175 cm)",
        weight: pm.weight || "68 kg",
        maritalStatus: pm.maritalStatus || "Never Married",
        motherTongue: pm.motherTongue || "Hindi",
        disabilityInfo: pm.disabilityInfo || "None",
        religion: pm.religion || "Hindu",
        community: pm.community || "General",
        caste: pm.caste || "Brahmin",
        subCaste: pm.subCaste || "Not Specified",
        gotra: pm.gotra || "Kashyap",
        manglik: pm.manglik || "Non-Manglik",
        horoscopeAvailable: pm.horoscopeAvailable ?? true,
        rashi: pm.rashi || "Simha (Leo)",
        nakshatra: pm.nakshatra || "Magha",
        birthTime: pm.birthTime || "08:30 AM",
        birthPlace: pm.birthPlace || "Pune, Maharashtra",
        education: pm.education || "B.Tech / M.Tech",
        degree: pm.degree || "B.Tech Computer Science",
        college: pm.college || "IIT Bombay",
        professionalQualification: pm.professionalQualification || "Cloud Architect",
        additionalCourses: pm.additionalCourses || "Executive Leadership",
        employmentType: pm.employmentType || "Private Sector",
        occupation: pm.occupation || "Senior Software Engineer",
        companyName: pm.companyName || "TechCorp India",
        workLocation: pm.workLocation || "Pune",
        annualIncome: pm.annualIncome || "25 - 30 Lakhs P.A.",
        incomePrivacy: pm.incomePrivacy || "Visible to Accepted Interests",
        fatherName: pm.fatherName || "Rajesh Sharma",
        fatherOccupation: pm.fatherOccupation || "Retired Bank Manager",
        motherName: pm.motherName || "Sunita Sharma",
        motherOccupation: pm.motherOccupation || "Homemaker",
        brothersCount: pm.brothersCount ?? 1,
        sistersCount: pm.sistersCount ?? 1,
        siblingsMaritalStatus: pm.siblingsMaritalStatus || "1 Married, 1 Unmarried",
        familyType: pm.familyType || "Nuclear",
        familyValues: pm.familyValues || "Moderate Traditional",
        familyStatus: pm.familyStatus || "Upper Middle Class",
        nativePlace: pm.nativePlace || "Jaipur, Rajasthan",
        familyLocation: pm.familyLocation || "Pune, Maharashtra",
        diet: pm.diet || "Vegetarian",
        smoking: pm.smoking || "No",
        drinking: pm.drinking || "No",
        fitnessLifestyle: pm.fitnessLifestyle || "Active / Yoga & Running",
        hobbies: pm.hobbies || "Reading, Trekking, Classical Music",
        interests: pm.interests || "Travel, Technology, Cooking",
        languagesKnown: pm.languagesKnown || "Hindi, English, Marathi",
        personalityDescription: pm.personalityDescription || "Calm, family-oriented, ambitious",
        country: pm.country || "India",
        state: pm.state || "Maharashtra",
        district: pm.district || "Pune",
        city: pm.city || pm.workCity || "Pune",
        currentResidence: pm.currentResidence || "Baner, Pune",
        nriStatus: pm.nriStatus || "Resident Indian",
        willingToRelocate: pm.willingToRelocate || "Open to Major Metros / Abroad",
        aboutMyself: pm.aboutMyself || pm.bio || "Family-oriented professional seeking a respectful, value-driven life partner.",
        aboutFamily: pm.aboutFamily || "Close-knit educated family with modern outlook and cultural roots.",
        aboutCareer: pm.aboutCareer || "Growing tech leadership trajectory with healthy work-life balance.",
        partnerExpectations: pm.partnerExpectations || "Looking for a kind, well-educated, and supportive life partner.",
        marriageValues: pm.marriageValues || "Mutual respect, honesty, emotional partnership, and family harmony.",
        photoVisibility: pm.photoVisibility || "Visible to All",
        videoIntroUrl: pm.videoIntroUrl || "",
        voiceIntroUrl: pm.voiceIntroUrl || "",
        biodataPdfStatus: pm.biodataPdfStatus || "Available",
      });
      setIsEditing(initialEditMode);
    }
  }, [account, initialEditMode, open]);

  if (!account) return null;

  const { user, verification, profileMeta, role } = account;

  const computeAge = (dobStr: string): number => {
    const parsed = new Date(dobStr);
    if (isNaN(parsed.getTime())) return 28;
    const diff = Date.now() - parsed.getTime();
    return Math.max(18, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
  };

  const handleSave = () => {
    if (onSaveUser) {
      onSaveUser(user.id, {
        user: {
          fullName: draftUser.fullName,
          email: draftUser.email,
          mobile: draftUser.mobile,
          gender: draftUser.gender,
          accountStatus: draftUser.accountStatus as AccountStatus,
          profileCreatedBy: draftUser.profileCreatedBy,
        },
        profileMeta: {
          ...draftProfile,
          age: computeAge(draftProfile.dob),
        },
      });
    }
    setIsEditing(false);
    toast({
      title: "User Details Updated",
      description: `All profile tables for ${draftUser.fullName} have been saved securely.`,
    });
  };

  const renderDetailTable = (
    title: string,
    icon: React.ReactNode,
    rows: Array<{
      label: string;
      key: string;
      source: "user" | "profile" | "readonly";
      value?: string;
      type?: "text" | "select" | "textarea";
      options?: string[];
    }>
  ) => (
    <div className="bg-white rounded-2xl border border-amber-200/90 overflow-hidden shadow-xs">
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-[#FFFDF9] border-b border-amber-200/80 flex items-center justify-between">
        <h3 className="font-serif-royal text-sm sm:text-base font-bold text-[#3B0A18] flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <span className="text-[11px] font-semibold text-[#8C6D62]">
          {rows.length} Fields
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#FAF5EE]/70 border-b border-amber-100 text-[11px] uppercase tracking-wider text-[#7C2D12]">
              <th className="py-2.5 px-4 font-bold w-1/3">Field Attribute</th>
              <th className="py-2.5 px-4 font-bold w-2/3">Registered Value / Admin Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100/80">
            {rows.map((row) => {
              const currentVal =
                row.source === "readonly"
                  ? row.value || "-"
                  : row.source === "user"
                  ? String(draftUser[row.key] ?? "")
                  : String(draftProfile[row.key] ?? "");

              const handleChange = (val: string) => {
                if (row.source === "user") {
                  setDraftUser((prev) => ({ ...prev, [row.key]: val }));
                } else if (row.source === "profile") {
                  setDraftProfile((prev) => ({ ...prev, [row.key]: val }));
                }
              };

              return (
                <tr key={row.key} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[#5C4740] align-top">
                    {row.label}
                  </td>
                  <td className="py-2 px-4 text-[#2B120C]">
                    {isEditing && row.source !== "readonly" ? (
                      row.type === "select" && row.options ? (
                        <select
                          value={currentVal}
                          onChange={(e) => handleChange(e.target.value)}
                          className="w-full h-9 rounded-lg border border-amber-300 bg-white px-2.5 text-xs font-medium text-[#2B120C] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/30"
                        >
                          {row.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : row.type === "textarea" ? (
                        <Textarea
                          value={currentVal}
                          onChange={(e) => handleChange(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border-amber-300 bg-white text-xs"
                        />
                      ) : (
                        <Input
                          value={currentVal}
                          onChange={(e) => handleChange(e.target.value)}
                          className="h-9 rounded-lg border-amber-300 bg-white text-xs"
                        />
                      )
                    ) : (
                      <span className="font-medium break-words">
                        {currentVal || <span className="text-slate-400 italic">Not provided</span>}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const basicTable = renderDetailTable("Table 1: Basic & Physical Information", <User className="w-4 h-4 text-[#EA580C]" />, [
    { label: "User Account ID", key: "id", source: "readonly", value: user.id },
    { label: "Full Name", key: "fullName", source: "user" },
    { label: "Email Address", key: "email", source: "user" },
    { label: "Mobile Number", key: "mobile", source: "user" },
    { label: "Gender", key: "gender", source: "user", type: "select", options: ["Male", "Female"] },
    { label: "Date of Birth", key: "dob", source: "profile" },
    { label: "Calculated Age", key: "calcAge", source: "readonly", value: `${computeAge(draftProfile.dob)} Years` },
    { label: "Height", key: "height", source: "profile" },
    { label: "Weight (Optional)", key: "weight", source: "profile" },
    {
      label: "Marital Status",
      key: "maritalStatus",
      source: "profile",
      type: "select",
      options: ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"],
    },
    { label: "Mother Tongue", key: "motherTongue", source: "profile" },
    {
      label: "Profile Created By",
      key: "profileCreatedBy",
      source: "user",
      type: "select",
      options: ["Self", "Parents", "Sibling", "Relative", "Friend"],
    },
    { label: "Disability Info (Privacy Controlled)", key: "disabilityInfo", source: "profile" },
    {
      label: "Account Status",
      key: "accountStatus",
      source: "user",
      type: "select",
      options: ["active", "pending_verification", "suspended", "deleted"],
    },
  ]);

  const religionTable = renderDetailTable("Table 2: Religion, Community & Horoscope", <Sparkles className="w-4 h-4 text-[#EA580C]" />, [
    { label: "Religion", key: "religion", source: "profile" },
    { label: "Community", key: "community", source: "profile" },
    { label: "Caste", key: "caste", source: "profile" },
    { label: "Sub-caste", key: "subCaste", source: "profile" },
    { label: "Gotra", key: "gotra", source: "profile" },
    {
      label: "Manglik Status",
      key: "manglik",
      source: "profile",
      type: "select",
      options: ["Non-Manglik", "Manglik", "Anshik Manglik", "Don't Know"],
    },
    { label: "Rashi (Moon Sign)", key: "rashi", source: "profile" },
    { label: "Nakshatra", key: "nakshatra", source: "profile" },
    { label: "Birth Time", key: "birthTime", source: "profile" },
    { label: "Birth Place", key: "birthPlace", source: "profile" },
  ]);

  const careerTable = renderDetailTable("Table 3: Education, Career & Income", <GraduationCap className="w-4 h-4 text-[#EA580C]" />, [
    { label: "Highest Education", key: "education", source: "profile" },
    { label: "Degree", key: "degree", source: "profile" },
    { label: "College / University", key: "college", source: "profile" },
    { label: "Professional Qualification", key: "professionalQualification", source: "profile" },
    { label: "Additional Courses", key: "additionalCourses", source: "profile" },
    {
      label: "Employment Type",
      key: "employmentType",
      source: "profile",
      type: "select",
      options: ["Private Sector", "Government / PSU", "Business / Entrepreneur", "Self-Employed", "Defense", "Not Working"],
    },
    { label: "Occupation / Designation", key: "occupation", source: "profile" },
    { label: "Company / Business Name", key: "companyName", source: "profile" },
    { label: "Work Location", key: "workLocation", source: "profile" },
    { label: "Annual Income Range", key: "annualIncome", source: "profile" },
    {
      label: "Income Privacy Setting",
      key: "incomePrivacy",
      source: "profile",
      type: "select",
      options: ["Public to Registered Users", "Visible to Accepted Interests", "Keep Private"],
    },
  ]);

  const familyTable = renderDetailTable("Table 4: Family Background & Siblings", <Users className="w-4 h-4 text-[#EA580C]" />, [
    { label: "Father's Name", key: "fatherName", source: "profile" },
    { label: "Father's Occupation", key: "fatherOccupation", source: "profile" },
    { label: "Mother's Name", key: "motherName", source: "profile" },
    { label: "Mother's Occupation", key: "motherOccupation", source: "profile" },
    { label: "Number of Brothers", key: "brothersCount", source: "profile" },
    { label: "Number of Sisters", key: "sistersCount", source: "profile" },
    { label: "Married / Unmarried Siblings", key: "siblingsMaritalStatus", source: "profile" },
    {
      label: "Family Type",
      key: "familyType",
      source: "profile",
      type: "select",
      options: ["Nuclear", "Joint", "Extended"],
    },
    {
      label: "Family Values",
      key: "familyValues",
      source: "profile",
      type: "select",
      options: ["Traditional", "Moderate Traditional", "Moderate", "Liberal"],
    },
    {
      label: "Family Status",
      key: "familyStatus",
      source: "profile",
      type: "select",
      options: ["Middle Class", "Upper Middle Class", "Affluent", "Rich / Royal"],
    },
    { label: "Native Place", key: "nativePlace", source: "profile" },
    { label: "Family Current Location", key: "familyLocation", source: "profile" },
  ]);

  const lifestyleLocationTable = renderDetailTable("Table 5: Lifestyle & Residence Location", <MapPin className="w-4 h-4 text-[#EA580C]" />, [
    {
      label: "Diet",
      key: "diet",
      source: "profile",
      type: "select",
      options: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Jain"],
    },
    { label: "Smoking", key: "smoking", source: "profile", type: "select", options: ["No", "Occasionally", "Yes"] },
    { label: "Drinking", key: "drinking", source: "profile", type: "select", options: ["No", "Socially", "Occasionally", "Yes"] },
    { label: "Fitness / Lifestyle", key: "fitnessLifestyle", source: "profile" },
    { label: "Hobbies", key: "hobbies", source: "profile" },
    { label: "Interests", key: "interests", source: "profile" },
    { label: "Languages Known", key: "languagesKnown", source: "profile" },
    { label: "Personality Description", key: "personalityDescription", source: "profile" },
    { label: "Country", key: "country", source: "profile" },
    { label: "State", key: "state", source: "profile" },
    { label: "District", key: "district", source: "profile" },
    { label: "City", key: "city", source: "profile" },
    { label: "Current Residence", key: "currentResidence", source: "profile" },
    {
      label: "NRI Status",
      key: "nriStatus",
      source: "profile",
      type: "select",
      options: ["Resident Indian", "NRI - USA", "NRI - UK", "NRI - Canada", "NRI - UAE", "NRI - Australia", "NRI - Other"],
    },
    { label: "Willingness to Relocate", key: "willingToRelocate", source: "profile" },
  ]);

  const aboutMediaTable = renderDetailTable("Table 6: About Me, Media & Verification", <FileText className="w-4 h-4 text-[#EA580C]" />, [
    { label: "Profile Photo URL", key: "primaryPhotoUrl", source: "profile" },
    { label: "Photo Visibility Control", key: "photoVisibility", source: "profile", type: "select", options: ["Visible to All", "Visible Only to Accepted Interests", "Blur with Request Access"] },
    { label: "About Myself", key: "aboutMyself", source: "profile", type: "textarea" },
    { label: "My Family", key: "aboutFamily", source: "profile", type: "textarea" },
    { label: "My Career", key: "aboutCareer", source: "profile", type: "textarea" },
    { label: "My Expectations", key: "partnerExpectations", source: "profile", type: "textarea" },
    { label: "What I Value in Marriage", key: "marriageValues", source: "profile", type: "textarea" },
    { label: "Mobile OTP Status", key: "mobVer", source: "readonly", value: verification.mobileVerified ? "Verified ✓" : "Pending" },
    { label: "Email OTP Status", key: "emailVer", source: "readonly", value: verification.emailVerified ? "Verified ✓" : "Pending" },
    { label: "Membership Role", key: "roleVal", source: "readonly", value: role.role.toUpperCase() },
    { label: "Biodata PDF / Horoscope", key: "biodataPdfStatus", source: "profile" },
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto bg-[#FFFDF9] border-amber-200 p-0 text-[#2B120C]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#3B0A18] to-[#5C1024] text-white p-5 sm:p-6 rounded-t-lg sticky top-0 z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-300 shrink-0 bg-white shadow-md">
                <img
                  src={draftProfile.primaryPhotoUrl || "/2.jpg"}
                  alt={draftUser.fullName}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif-royal text-xl sm:text-2xl font-bold">
                    {draftUser.fullName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-[#3B0A18]">
                    {role.role.toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      draftUser.accountStatus === "active"
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {String(draftUser.accountStatus).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 mt-1">
                  ID: {user.id} • {draftUser.email} • +91 {draftUser.mobile} • Completion: {profileMeta.profileCompletion}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    className="h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save All Changes
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="h-9 rounded-xl border-amber-200/50 bg-white/10 text-white hover:bg-white/20 text-xs font-semibold"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-9 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#3B0A18] font-bold text-xs"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1.5" />
                  Edit User Details
                </Button>
              )}
            </div>
          </div>

          {/* Separate Table Filter Tabs */}
          <div className="flex overflow-x-auto gap-2 pt-4 border-t border-white/15 mt-4 no-scrollbar">
            {[
              { id: "all_tables", label: "All 6 Tables View", icon: ShieldCheck },
              { id: "basic", label: "1. Basic & Physical", icon: User },
              { id: "religion", label: "2. Religion & Astro", icon: Sparkles },
              { id: "career", label: "3. Education & Career", icon: GraduationCap },
              { id: "family", label: "4. Family Details", icon: Users },
              { id: "lifestyle", label: "5. Lifestyle & Location", icon: MapPin },
              { id: "media", label: "6. About & Media", icon: Camera },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as DossierTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-amber-400 text-[#3B0A18] shadow"
                      : "bg-white/10 text-amber-100 hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Separate Tables Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {isEditing && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
              <span className="font-semibold flex items-center gap-1.5">
                <Pencil className="w-4 h-4 text-emerald-700" />
                Admin Edit Mode Active — Modify any field inside the tables below and click &ldquo;Save All Changes&rdquo;.
              </span>
            </div>
          )}

          {(activeTab === "all_tables" || activeTab === "basic") && basicTable}
          {(activeTab === "all_tables" || activeTab === "religion") && religionTable}
          {(activeTab === "all_tables" || activeTab === "career") && careerTable}
          {(activeTab === "all_tables" || activeTab === "family") && familyTable}
          {(activeTab === "all_tables" || activeTab === "lifestyle") && lifestyleLocationTable}
          {(activeTab === "all_tables" || activeTab === "media") && aboutMediaTable}

          {/* Footer Governance Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-200">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => onMakeVip(user.id)}
                className="h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#7C2D12] border border-amber-300 text-xs font-bold"
              >
                <Crown className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                {role.role === "vip" ? "Downgrade to Member" : "Upgrade to VIP"}
              </Button>
              {user.accountStatus === "suspended" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onActivate(user.id)}
                  className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Activate Account
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onSuspend(user.id)}
                  className="h-9 rounded-xl border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Suspend Account
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="h-9 rounded-xl bg-saffron-gradient text-white font-bold text-xs px-5"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Changes
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 rounded-xl border-amber-300 text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
