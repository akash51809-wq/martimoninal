export type PreferencePriorityLevel =
  | "Must Have"
  | "Strong Preference"
  | "Nice to Have"
  | "Flexible";

export interface PartnerPreferenceCriteria {
  userId?: string;
  ageMin: number;
  ageMax: number;
  heightMinCm: number;
  heightMaxCm: number;
  maritalStatus: string[];
  religions: string[];
  castes: string[];
  motherTongues: string[];
  educationLevels: string[];
  employedIn: string[];
  occupations: string[];
  minAnnualIncomeLpa: number;
  preferredCities: string[];
  preferredStates: string[];
  preferredCountries: string[];
  diet: string[];
  smoking: string;
  drinking: string;
  manglik: string;

  // Extended Family & Location Preferences
  familyTypes?: string[];
  familyValues?: string[];
  willingToRelocate?: string;
  preferredHobbies?: string[];

  // 7. Marriage Expectations
  marriageExpectations?: {
    timeline: string;
    childrenPreference: string;
    careerAfterMarriage: string;
    relocationAfterMarriage: string;
    familyResponsibilities: string;
    religiousCultural: string;
  };

  // 8. Dealbreakers (Hard Filters)
  dealbreakers?: {
    strictAgeRange: boolean;
    strictMaritalStatus: boolean;
    nonSmokerOnly: boolean;
    nonDrinkerOnly: boolean;
    strictLocation: boolean;
    strictDiet: boolean;
    strictManglik: boolean;
  };

  // 9. Flexible Preferences (Nice to Have)
  flexiblePreferences?: {
    sameCity: boolean;
    sameProfession: boolean;
    sameHobbies: boolean;
    sameCommunity: boolean;
    similarFamilyBackground: boolean;
  };

  // 10. Preference Priority Levels (For AI Weighting)
  priorities?: {
    age: PreferencePriorityLevel;
    community: PreferencePriorityLevel;
    education: PreferencePriorityLevel;
    careerIncome: PreferencePriorityLevel;
    location: PreferencePriorityLevel;
    family: PreferencePriorityLevel;
    lifestyle: PreferencePriorityLevel;
    horoscope: PreferencePriorityLevel;
  };
}

export type MatchFeedCategory =
  | "daily"
  | "best"
  | "new"
  | "mutual"
  | "recently_active"
  | "nearby"
  | "same_community"
  | "similar_education"
  | "similar_career"
  | "family_compat"
  | "horoscope"
  | "lifestyle"
  | "values_goals"
  | "verified";

export interface MatchProfileItem {
  id: string;
  profileId: string;
  name: string;
  gender: "Female" | "Male";
  age: number;
  dob: string;
  height: string;
  heightCm: number;
  profession: string;
  professionTag: string;
  education: string;
  college: string;
  company?: string;
  city: string;
  state: string;
  country: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  gotra: string;
  rashi: string;
  nakshatra: string;
  manglik: "Non-Manglik" | "Manglik" | "Anshik Manglik";
  kundliScore: number;
  income: string;
  annualIncomeLpa: number;
  email: string;
  mobile: string;
  verified: boolean;
  online: boolean;
  bio: string;
  photos: string[];
  isGovtJob?: boolean;
  isPremierInstitute?: boolean;
  isNri?: boolean;
  registeredDaysAgo?: number;

  // Matching Engine computed scores
  matchScore: number; // 0 - 100
  matchReasons: string[];
  isMutualMatch: boolean;
  isNewMember: boolean;
  isVerifiedGovtId: boolean;

  // Advanced Matching Engine Features (2, 4, 5, 6, 8)
  smartRankScore?: number;
  successProbability?: number;
  successStabilityGrade?: string;
  personalityBadge?: string;
  personalityScore?: number;
  candidateArchetype?: string;
  twoWayMutualScore?: number;
  candidateSatisfiesUserPct?: number;
  userSatisfiesCandidatePct?: number;
  multidimensionalScore?: {
    lifestyle: { score: number; label: string; status: string; highlights: string[] };
    family: { score: number; label: string; status: string; highlights: string[] };
    educationCareer: { score: number; label: string; status: string; highlights: string[] };
    compositeScore: number;
  };

  // Extended Discovery & AI Explanation Metadata
  profileCompleteness?: number;
  isPremiumMember?: boolean;
  profileCreatedBy?: string;
  horoscopeAvailable?: boolean;
  dealbreakerPassed?: boolean;
  dealbreakerWarnings?: string[];
  marriageGoalScore?: number;
  interestScore?: number;
  valuesScore?: number;
  profileRelevanceScore?: number;
  matchExplanation?: string[];
}

export interface AdvancedSearchFilters {
  query?: string;
  gender?: "All" | "Female" | "Male";
  ageMin?: number;
  ageMax?: number;
  heightMinCm?: number;
  heightMaxCm?: number;
  maritalStatuses?: string[];
  religions?: string[];
  castes?: string[];
  motherTongues?: string[];
  cities?: string[];
  states?: string[];
  countries?: string[];

  // Professional & Elite Filters
  isGovtJob?: boolean;
  isPremierInstitute?: boolean; // IIT, IIM, AIIMS, NIT, BITS
  isNri?: boolean;
  minIncomeLpa?: number;
  maxIncomeLpa?: number;
  occupations?: string[];
  diet?: string[];
  smoking?: string;
  drinking?: string;

  // Family Background Filters
  familyTypes?: string[];
  familyValues?: string[];
  familyStatuses?: string[];

  // Horoscope & Astrology Filters
  manglik?: string;
  rashis?: string[];
  nakshatras?: string[];
  minKundliScore?: number;
  verifiedOnly?: boolean;
  horoscopeAvailableOnly?: boolean;
  premiumOnly?: boolean;
  minProfileCompleteness?: number;
  recentlyJoinedDays?: number;
  profileCreatedBy?: string[];
  excludeViewed?: boolean;
  excludeRejected?: boolean;
  viewerUserId?: string;

  // Sorting & Paging
  sortBy?:
    | "relevance"
    | "newest"
    | "income_desc"
    | "age_asc"
    | "kundli_desc"
    | "completeness"
    | "recently_active"
    | "compatibility";
  page?: number;
  limit?: number;
}

export interface SavedSearchItem {
  id: string;
  userId: string;
  searchName: string;
  filters: AdvancedSearchFilters;
  alertsEnabled: boolean;
  matchCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponsePayload {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  results: MatchProfileItem[];
  activeFiltersCount: number;
}
