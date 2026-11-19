export interface SuccessStory {
  id: string;
  couple: string;
  location: string;
  marriedDate: string;
  quote: string;
  image: string;
  tag: string;
}

export interface TrustStat {
  value: string;
  label: string;
  sublabel: string;
}

export const TRUST_STATS: TrustStat[] = [
  {
    value: "2.4M+",
    label: "Verified Profiles",
    sublabel: "Aadhaar & Selfie Screened",
  },
  {
    value: "185K+",
    label: "Sacred Weddings",
    sublabel: "Across 28 Indian States & NRI",
  },
  {
    value: "36-Guna",
    label: "Vedic Kundli Engine",
    sublabel: "Instant Ashtakoot Compatibility",
  },
  {
    value: "4.9 ★",
    label: "Family Trust Score",
    sublabel: "Zero-Spam Privacy Shield",
  },
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    couple: "Raghav & Meera Kulkarni",
    location: "Pune, Maharashtra",
    marriedDate: "Married • Feb 2026",
    quote:
      "Both our families wanted a match rooted in values yet open to modern careers. Vivah Kar Lo's 33/36 Kundli report and verified family intro made our first meeting effortless.",
    image: "/1.jpg",
    tag: "33/36 Gunas Match",
  },
  {
    id: "story-2",
    couple: "Karthik & Divya Sundaram",
    location: "Chennai & Bengaluru",
    marriedDate: "Married • Dec 2025",
    quote:
      "What set Vivah Kar Lo apart was the dignity and privacy. Every profile was genuine, and the Relationship Advisor coordinated both families seamlessly.",
    image: "/3.jpg",
    tag: "Platinum VIP Alliance",
  },
  {
    id: "story-3",
    couple: "Siddharth & Niharika Jain",
    location: "Mumbai & Ahmedabad",
    marriedDate: "Married • Jan 2026",
    quote:
      "Within three weeks of registering, our parents spoke over Vivah Kar Lo's private call feature. Six months later, we celebrated our dream wedding in Udaipur.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80",
    tag: "Verified Family Match",
  },
];

export const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Create & Verify Your Profile",
    description:
      "Register free in 3 minutes with family details, career highlights, and horoscope. Profiles undergo Govt. ID & selfie screening for 100% authenticity.",
  },
  {
    step: "02",
    title: "AI + Vedic Kundli Matching",
    description:
      "Discover handpicked matches scored across 36-Guna Ashtakoot Milan, education, lifestyle preferences, and shared family values.",
  },
  {
    step: "03",
    title: "Connect Privately With Families",
    description:
      "Express interest, exchange verified horoscopes, and converse through privacy-masked voice calls, video introductions, and end-to-end encrypted chat.",
  },
];

export const SECURITY_PILLARS = [
  {
    title: "100% ID & Selfie Verification",
    description:
      "Every active profile is screened against official identity documents and live photo checks before appearing in searches.",
  },
  {
    title: "Granular Photo & Contact Privacy",
    description:
      "Control who sees your contact number, horoscope, and photo gallery—unlockable only for mutually accepted alliances.",
  },
  {
    title: "Family-First Moderated Chat",
    description:
      "Communicate directly or involve parents in family-verified chat rooms with zero spam and instant reporting protection.",
  },
  {
    title: "Dedicated Relationship Concierge",
    description:
      "Gold & Platinum members receive personalized shortlisting, background coordination, and astrology consultations.",
  },
];

export const POPULAR_CATEGORIES = {
  communities: [
    "Maratha",
    "Brahmin",
    "Patel",
    "Agarwal",
    "Jain",
    "Rajput",
    "Kayastha",
    "Reddy",
    "Nair",
    "Sikh",
  ],
  cities: [
    "Mumbai",
    "Pune",
    "Delhi NCR",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Ahmedabad",
    "Jaipur",
    "Kolkata",
  ],
  motherTongues: [
    "Hindi",
    "Marathi",
    "Gujarati",
    "Tamil",
    "Telugu",
    "Kannada",
    "Punjabi",
    "Bengali",
  ],
};
