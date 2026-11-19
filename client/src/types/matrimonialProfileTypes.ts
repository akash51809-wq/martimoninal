// ============================================================================
// VIVAH KAR LO - MATRIMONIAL PROFILE DATA TYPES
// Programme 02: Multi-Step Matrimonial Profile Creation Wizard
// ============================================================================

export type MaritalStatusOption =
  | "Never Married"
  | "Divorced"
  | "Widowed"
  | "Awaiting Divorce"
  | "Annulled";

export type PhysicalStatusOption =
  | "Normal"
  | "Physically Challenged"
  | "Specially Abled";

export type BloodGroupOption =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-"
  | "Don't Know";

export type ReligionOption =
  | "Hindu"
  | "Muslim"
  | "Sikh"
  | "Christian"
  | "Jain"
  | "Buddhist"
  | "Parsi"
  | "Jewish"
  | "Other";

export type ManglikOption =
  | "Non-Manglik"
  | "Manglik"
  | "Anshik Manglik (Partial)"
  | "Don't Know";

export type EmploymentTypeOption =
  | "Private Company"
  | "Government / Public Sector"
  | "Business / Entrepreneur"
  | "Civil Services / IAS / IPS"
  | "Defense / Armed Forces"
  | "Self Employed / Consultant"
  | "Not Working"
  | "NRI / Working Abroad";

export type AnnualIncomeOption =
  | "Below ₹3 Lakhs"
  | "₹3 - 5 Lakhs"
  | "₹5 - 7.5 Lakhs"
  | "₹7.5 - 10 Lakhs"
  | "₹10 - 15 Lakhs"
  | "₹15 - 25 Lakhs"
  | "₹25 - 50 Lakhs"
  | "₹50 Lakhs - 1 Crore"
  | "₹1 Crore+ / $150K+";

export type DietOption =
  | "Pure Vegetarian"
  | "Vegetarian (Eggetarian)"
  | "Non-Vegetarian"
  | "Jain"
  | "Vegan";

export type HabitOption = "No" | "Occasionally" | "Yes";

export type FamilyTypeOption = "Nuclear" | "Joint";

export type FamilyValuesOption = "Traditional" | "Moderate" | "Liberal";

export type FamilyStatusOption =
  | "Middle Class"
  | "Upper Middle Class"
  | "Rich / Affluent"
  | "High Net-Worth / Elite";

export type PhotoPrivacyOption =
  | "Visible to All"
  | "Visible to Connected Members Only"
  | "Blurred (Unlock on Request)";

export interface Step1PhysicalData {
  heightCm: number;
  heightDisplay: string; // e.g. "5 ft 10 in - 177 cm"
  weightKg: number;
  bloodGroup: BloodGroupOption;
  physicalStatus: PhysicalStatusOption;
  maritalStatus: MaritalStatusOption;
  bodyType?: "Slim" | "Athletic" | "Average" | "Heavy";
}

export interface Step2ReligiousData {
  religion: ReligionOption;
  caste: string;
  subCaste?: string;
  gothram?: string;
  manglikStatus: ManglikOption;
  motherTongue: string;
  rashi?: string;
  nakshatra?: string;
}

export interface Step3EducationCareerData {
  highestDegree: string;
  collegeUniversity: string;
  employedIn: EmploymentTypeOption;
  occupation: string;
  organizationName?: string;
  annualIncome: AnnualIncomeOption;
  workCity: string;
  workState: string;
  workCountry: string;
}

export interface Step4LifestyleData {
  diet: DietOption;
  smoking: HabitOption;
  drinking: HabitOption;
  hobbies: string[];
}

export interface Step5FamilyData {
  fatherOccupation: string;
  motherOccupation: string;
  brothersCount: number;
  brothersMarried: number;
  sistersCount: number;
  sistersMarried: number;
  familyType: FamilyTypeOption;
  familyValues: FamilyValuesOption;
  familyStatus: FamilyStatusOption;
  nativePlace: string;
  aboutFamily?: string;
}

export interface Step6PhotosBioData {
  primaryPhotoUrl: string;
  galleryPhotoUrls: string[];
  photoPrivacy: PhotoPrivacyOption;
  bio: string;
}

export interface FullMatrimonialProfile {
  userId: string;
  completionPercentage: number;
  profileStatus: "incomplete" | "complete" | "under_review" | "verified";
  physical: Step1PhysicalData;
  religious: Step2ReligiousData;
  education: Step3EducationCareerData;
  lifestyle: Step4LifestyleData;
  family: Step5FamilyData;
  media: Step6PhotosBioData;
  updatedAt: string;
}
