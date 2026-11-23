export interface ProfileData {
  id: string;
  profileId: string;
  name: string;
  gender: 'Female' | 'Male';
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
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik Manglik';
  kundliScore: number;
  income: string;
  annualIncomeLpa: number;
  email: string;
  mobile: string;
  verified: boolean;
  online: boolean;
  bio: string;
  photos: string[];
  interests: { label: string; icon: string; category: string }[];
  family: {
    father: string;
    fatherOccupation: string;
    mother: string;
    motherOccupation: string;
    siblings: string;
    familyType: string;
    familyValues: string;
    nativePlace: string;
  };
  lifestyle: {
    diet: string;
    drink: string;
    smoke: string;
    hobbies: string[];
  };
  partnerPreferences: {
    ageRange: string;
    heightRange: string;
    education: string;
    caste: string;
    maritalStatus: string;
    income: string;
    preferredCities: string[];
  };
}

export const MOCK_PROFILES: ProfileData[] = [
  {
    id: "1",
    profileId: "#000003",
    name: "Shivani Doe",
    gender: "Female",
    age: 25,
    dob: "28/02/1999",
    height: "165cm - 5.5 Ft",
    heightCm: 165,
    profession: "Doctor (BHMS)",
    professionTag: "Doctor",
    education: "BHMS - Bachelor of Homeopathic Medicine",
    college: "Dr. D.Y. Patil Medical College",
    company: "City Wellness Clinic & Hospital",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Maratha",
    subCaste: "96 Kuli",
    motherTongue: "Marathi",
    gotra: "Kashyap",
    rashi: "Kanya (Virgo)",
    nakshatra: "Hasta",
    manglik: "Non-Manglik",
    kundliScore: 32,
    income: "₹12 - 15 Lakhs P.A.",
    annualIncomeLpa: 14,
    email: "shivani.doe@vivahkarlo.com",
    mobile: "+91 98765 43210",
    verified: true,
    online: true,
    bio: "Passionate medical practitioner who loves classical Bharatnatyam, reading historical novels, and weekend road trips with family. Looking for an educated, caring companion who values Indian traditions with a modern outlook.",
    photos: [
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
    ],
    interests: [
      { label: "Classical Dance", icon: "sparkles", category: "Arts" },
      { label: "Book Reading", icon: "book-open", category: "Hobbies" },
      { label: "Yoga & Wellness", icon: "heart", category: "Fitness" },
      { label: "Travel & Nature", icon: "compass", category: "Outdoors" },
      { label: "Cooking Traditional Food", icon: "utensils", category: "Culinary" }
    ],
    family: {
      father: "Arun Doe",
      fatherOccupation: "Retired Class I Gazetted Officer",
      mother: "Sunita Doe",
      motherOccupation: "Principal at High School",
      siblings: "1 Younger Brother (Software Engineer at Infosys)",
      familyType: "Nuclear Family",
      familyValues: "Moderate Traditional",
      nativePlace: "Kolhapur, Maharashtra"
    },
    lifestyle: {
      diet: "Vegetarian",
      drink: "No",
      smoke: "No",
      hobbies: ["Reading", "Yoga", "Classical Music", "Cooking"]
    },
    partnerPreferences: {
      ageRange: "26 - 31 Yrs",
      heightRange: "5'7\" - 6'2\"",
      education: "Doctor / Engineer / MBA / CA",
      caste: "Maratha / Open to Brahmin / Kshatriya",
      maritalStatus: "Never Married",
      income: "₹15 Lakhs+ P.A.",
      preferredCities: ["Hyderabad", "Pune", "Mumbai", "Bengaluru"]
    }
  },
  {
    id: "2",
    profileId: "#000002",
    name: "Vishal Sharma",
    gender: "Male",
    age: 27,
    dob: "14/08/1997",
    height: "178cm - 5.10 Ft",
    heightCm: 178,
    profession: "Senior Software Engineer",
    professionTag: "Software Engineer",
    education: "B.Tech Computer Science (IIT Bombay)",
    college: "Indian Institute of Technology Bombay",
    company: "Microsoft IDC",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Deshastha",
    motherTongue: "Hindi",
    gotra: "Vashistha",
    rashi: "Tula (Libra)",
    nakshatra: "Swati",
    manglik: "Non-Manglik",
    kundliScore: 30,
    income: "₹28 - 32 Lakhs P.A.",
    annualIncomeLpa: 30,
    email: "vishal.sharma@vivahkarlo.com",
    mobile: "+91 97654 32109",
    verified: true,
    online: true,
    bio: "Tech enthusiast who enjoys fitness, cricket, and weekend acoustic guitar sessions. Believe in mutual respect, laughter, and building a blissful home together.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
    ],
    interests: [
      { label: "Cricket", icon: "trophy", category: "Sports" },
      { label: "Guitar", icon: "music", category: "Music" },
      { label: "Tech Innovations", icon: "cpu", category: "Hobbies" },
      { label: "Trekking", icon: "mountain", category: "Outdoors" }
    ],
    family: {
      father: "Rajesh Sharma",
      fatherOccupation: "Businessman (Real Estate)",
      mother: "Kavita Sharma",
      motherOccupation: "Homemaker",
      siblings: "1 Elder Sister (Married, Settled in Pune)",
      familyType: "Joint Family",
      familyValues: "Traditional with Modern Spirit",
      nativePlace: "Indore, Madhya Pradesh"
    },
    lifestyle: {
      diet: "Vegetarian",
      drink: "Occasional",
      smoke: "No",
      hobbies: ["Guitar", "Badminton", "Reading tech blogs"]
    },
    partnerPreferences: {
      ageRange: "23 - 27 Yrs",
      heightRange: "5'2\" - 5'8\"",
      education: "Graduate / Post Graduate",
      caste: "Brahmin / Open to all",
      maritalStatus: "Never Married",
      income: "Doesn't matter / Open",
      preferredCities: ["Pune", "Mumbai", "Bengaluru", "Indore"]
    }
  },
  {
    id: "3",
    profileId: "#000004",
    name: "Rani Patel",
    gender: "Female",
    age: 24,
    dob: "19/11/2000",
    height: "162cm - 5.4 Ft",
    heightCm: 162,
    profession: "Fashion Designer & Boutique Owner",
    professionTag: "Fashion Designer",
    education: "B.Des (NIFT Gandhinagar)",
    college: "National Institute of Fashion Technology",
    company: "Rani Couture Label",
    city: "Surat",
    state: "Gujarat",
    country: "India",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Patel",
    subCaste: "Kadva",
    motherTongue: "Gujarati",
    gotra: "Sandilya",
    rashi: "Vrishabha (Taurus)",
    nakshatra: "Rohini",
    manglik: "Non-Manglik",
    kundliScore: 34,
    income: "₹18 - 22 Lakhs P.A.",
    annualIncomeLpa: 20,
    email: "rani.patel@vivahkarlo.com",
    mobile: "+91 99887 76655",
    verified: true,
    online: false,
    bio: "Creative mind who loves design, festive celebrations, sketching, and making people feel beautiful. Seeking a grounded, ambitious partner with a good sense of humor.",
    photos: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
    ],
    interests: [
      { label: "Fashion Styling", icon: "sparkles", category: "Creative" },
      { label: "Baking", icon: "cake", category: "Culinary" },
      { label: "Garba / Folk Dance", icon: "activity", category: "Culture" },
      { label: "Art Galleries", icon: "palette", category: "Arts" }
    ],
    family: {
      father: "Pravin Patel",
      fatherOccupation: "Diamond Merchant & Textile Manufacturer",
      mother: "Rekha Patel",
      motherOccupation: "Homemaker",
      siblings: "2 Brothers (Both looking after family business)",
      familyType: "Joint Family",
      familyValues: "Affluent Traditional",
      nativePlace: "Mehsana, Gujarat"
    },
    lifestyle: {
      diet: "Pure Vegetarian (Jain friendly)",
      drink: "No",
      smoke: "No",
      hobbies: ["Designing", "Travel", "Coffee tasting"]
    },
    partnerPreferences: {
      ageRange: "25 - 30 Yrs",
      heightRange: "5'7\" - 6'1\"",
      education: "CA / MBA / Engineer / Entrepreneur",
      caste: "Patel / Gujarati Community",
      maritalStatus: "Never Married",
      income: "₹20 Lakhs+ P.A.",
      preferredCities: ["Surat", "Ahmedabad", "Mumbai", "Vadodara"]
    }
  },
  {
    id: "4",
    profileId: "#000005",
    name: "Shital Verma",
    gender: "Female",
    age: 26,
    dob: "05/06/1998",
    height: "168cm - 5.6 Ft",
    heightCm: 168,
    profession: "Chartered Accountant (Assistant Manager)",
    professionTag: "Chartered Accountant",
    education: "FCA, B.Com (Hons) SRCC Delhi",
    college: "Shri Ram College of Commerce, DU",
    company: "Ernst & Young (EY)",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Kayastha",
    subCaste: "Srivastava",
    motherTongue: "Hindi",
    gotra: "Bharadwaj",
    rashi: "Mithun (Gemini)",
    nakshatra: "Ardra",
    manglik: "Non-Manglik",
    kundliScore: 29,
    income: "₹22 - 25 Lakhs P.A.",
    annualIncomeLpa: 24,
    email: "shital.verma@vivahkarlo.com",
    mobile: "+91 91234 56789",
    verified: true,
    online: true,
    bio: "Finance professional with an eye for detail and a heart full of warmth. I enjoy morning runs by Marine Drive, podcast discussions, and cooking for friends on weekends.",
    photos: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80"
    ],
    interests: [
      { label: "Marathon Running", icon: "footprints", category: "Fitness" },
      { label: "Financial Markets", icon: "trending-up", category: "Finance" },
      { label: "Cinema & Theater", icon: "film", category: "Entertainment" },
      { label: "Baking Sourdough", icon: "coffee", category: "Culinary" }
    ],
    family: {
      father: "Sudhir Verma",
      fatherOccupation: "Deputy General Manager, State Bank of India",
      mother: "Manju Verma",
      motherOccupation: "Associate Professor (Economics)",
      siblings: "1 Brother (Pursuing MS in USA)",
      familyType: "Nuclear Family",
      familyValues: "Liberal & Progressive",
      nativePlace: "Lucknow, Uttar Pradesh"
    },
    lifestyle: {
      diet: "Eggetarian",
      drink: "Social",
      smoke: "No",
      hobbies: ["Running", "Reading", "Documentaries"]
    },
    partnerPreferences: {
      ageRange: "27 - 32 Yrs",
      heightRange: "5'8\" - 6'3\"",
      education: "CA / MBA (IIM) / Tech Leads",
      caste: "Open to all Hindu communities",
      maritalStatus: "Never Married",
      income: "₹25 Lakhs+ P.A.",
      preferredCities: ["Mumbai", "Delhi NCR", "Pune", "Bengaluru"]
    }
  },
  {
    id: "5",
    profileId: "#000006",
    name: "Aditya Deshmukh",
    gender: "Male",
    age: 28,
    dob: "12/03/1996",
    height: "182cm - 6.0 Ft",
    heightCm: 182,
    profession: "Architect & Principal Designer",
    professionTag: "Architect",
    education: "B.Arch (Sir J.J. College of Architecture)",
    college: "Sir J.J. College of Architecture, Mumbai",
    company: "Deshmukh & Associates Architects",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Maratha",
    subCaste: "Deshmukh",
    motherTongue: "Marathi",
    gotra: "Atri",
    rashi: "Dhanu (Sagittarius)",
    nakshatra: "Moola",
    manglik: "Non-Manglik",
    kundliScore: 31,
    income: "₹30 - 35 Lakhs P.A.",
    annualIncomeLpa: 32,
    email: "aditya.d@vivahkarlo.com",
    mobile: "+91 98220 12345",
    verified: true,
    online: true,
    bio: "Passionate about sustainable architecture, heritage restoration, and wildlife photography. Looking for an independent, cheerful partner who loves nature and meaningful conversations.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80"
    ],
    interests: [
      { label: "Wildlife Photography", icon: "camera", category: "Creative" },
      { label: "Heritage Travel", icon: "landmark", category: "Outdoors" },
      { label: "Cycling", icon: "bike", category: "Fitness" }
    ],
    family: {
      father: "Dilip Deshmukh",
      fatherOccupation: "Civil Engineer & Govt Contractor",
      mother: "Usha Deshmukh",
      motherOccupation: "Homemaker",
      siblings: "1 Sister (Architect, Married)",
      familyType: "Joint Family",
      familyValues: "Cultured Maratha",
      nativePlace: "Satara, Maharashtra"
    },
    lifestyle: {
      diet: "Non-Vegetarian",
      drink: "Social",
      smoke: "No",
      hobbies: ["Architecture sketching", "Photography", "Badminton"]
    },
    partnerPreferences: {
      ageRange: "24 - 28 Yrs",
      heightRange: "5'3\" - 5'9\"",
      education: "Post Graduate / Professional Degree",
      caste: "Maratha / 96 Kuli",
      maritalStatus: "Never Married",
      income: "₹10 Lakhs+ P.A.",
      preferredCities: ["Pune", "Mumbai", "Nashik", "Kolhapur"]
    }
  },
  {
    id: "6",
    profileId: "#000007",
    name: "Ananya Iyer",
    gender: "Female",
    age: 25,
    dob: "30/09/1999",
    height: "167cm - 5.6 Ft",
    heightCm: 167,
    profession: "AI Research Scientist",
    professionTag: "Data Scientist",
    education: "M.Tech AI (IISc Bangalore)",
    college: "Indian Institute of Science Bangalore",
    company: "Google DeepMind Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Iyer / Vadama",
    motherTongue: "Tamil",
    gotra: "Gautama",
    rashi: "Simha (Leo)",
    nakshatra: "Magha",
    manglik: "Non-Manglik",
    kundliScore: 33,
    income: "₹40 - 45 Lakhs P.A.",
    annualIncomeLpa: 42,
    email: "ananya.iyer@vivahkarlo.com",
    mobile: "+91 98401 23456",
    verified: true,
    online: true,
    bio: "Carnatic classical vocalist and machine learning researcher. I cherish intellectual discussions, South Indian filter coffee, and temple architecture.",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
    ],
    interests: [
      { label: "Carnatic Singing", icon: "mic", category: "Music" },
      { label: "AI & Mathematics", icon: "binary", category: "Academics" },
      { label: "Book Collecting", icon: "book", category: "Hobbies" }
    ],
    family: {
      father: "S. Subramanian",
      fatherOccupation: "Professor of Physics (IIT Madras)",
      mother: "Lakshmi Subramanian",
      motherOccupation: "Veena Artist & Music Teacher",
      siblings: "None (Only child)",
      familyType: "Nuclear Family",
      familyValues: "Orthodox Traditional with Global Outlook",
      nativePlace: "Thanjavur, Tamil Nadu"
    },
    lifestyle: {
      diet: "Pure Vegetarian",
      drink: "No",
      smoke: "No",
      hobbies: ["Singing", "Chess", "Reading"]
    },
    partnerPreferences: {
      ageRange: "26 - 31 Yrs",
      heightRange: "5'8\" - 6'2\"",
      education: "Masters / Doctorate / Tech Professional",
      caste: "Brahmin (Iyer / Iyengar / Deshastha)",
      maritalStatus: "Never Married",
      income: "₹35 Lakhs+ P.A.",
      preferredCities: ["Bengaluru", "Chennai", "Hyderabad", "San Francisco"]
    }
  }
];

export const MOCK_COMMUNITIES = [
  "All Communities",
  "Maratha",
  "Brahmin",
  "Patel",
  "Kayastha",
  "Rajput",
  "Jain",
  "Agarwal",
  "Reddy",
  "Nair",
  "Yadav",
  "Lingayat",
  "Sikh"
];

export const MOCK_LANGUAGES = [
  { code: "en", name: "English", label: "English" },
  { code: "hi", name: "Hindi", label: "Hindi" },
  { code: "mr", name: "Marathi", label: "Marathi" },
  { code: "gu", name: "Gujarati", label: "Gujarati" },
  { code: "ta", name: "Tamil", label: "Tamil" },
  { code: "te", name: "Telugu", label: "Telugu" },
  { code: "bn", name: "Bengali", label: "Bengali" },
  { code: "pa", name: "Punjabi", label: "Punjabi" }
];

export const MOCK_CHATS = [
  {
    profileId: "1",
    candidateName: "Shivani Doe",
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Thank you for expressing interest! We would be delighted to talk.",
    timestamp: "10:30 AM",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", sender: "other", text: "Namaste! I received your profile request.", time: "Yesterday, 6:45 PM" },
      { id: "m2", sender: "user", text: "Namaste Shivani ji! Glad to connect. Your profile and hobbies really resonated with me.", time: "Yesterday, 7:12 PM" },
      { id: "m3", sender: "other", text: "Thank you! I noticed we both have a mutual passion for travel and reading. How was your weekend?", time: "10:15 AM" },
      { id: "m4", sender: "other", text: "Thank you for expressing interest! We would be delighted to talk.", time: "10:30 AM" }
    ]
  },
  {
    profileId: "4",
    candidateName: "Shital Verma",
    avatar: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Yes, our horoscopes matched 29 gunas! My parents are very happy.",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", sender: "user", text: "Hello Shital, hope you are having a productive week!", time: "2 days ago" },
      { id: "m2", sender: "other", text: "Hi! Yes, our horoscopes matched 29 gunas! My parents are very happy.", time: "Yesterday" }
    ]
  },
  {
    profileId: "3",
    candidateName: "Rani Patel",
    avatar: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Shared her contact details with you.",
    timestamp: "2 days ago",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", sender: "other", text: "Shared her contact details with you.", time: "2 days ago" }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Interest Accepted! 🎉",
    body: "Shivani Doe accepted your interest request. You can now chat directly.",
    time: "15 min ago",
    read: false,
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80",
    type: "interest"
  },
  {
    id: "n2",
    title: "High Horoscope Compatibility 🌟",
    body: "New Match! Ananya Iyer matches 33/36 Gunas with your Kundli.",
    time: "2 hours ago",
    read: false,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    type: "horoscope"
  },
  {
    id: "n3",
    title: "Profile Viewed 👀",
    body: "Rani Patel and 4 others viewed your profile today.",
    time: "5 hours ago",
    read: true,
    avatar: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=200&q=80",
    type: "view"
  },
  {
    id: "n4",
    title: "VIP Member Perk 👑",
    body: "Your profile is getting 3X more visibility this week.",
    time: "1 day ago",
    read: true,
    avatar: "/logo-rings.svg",
    type: "system"
  }
];

export const MOCK_VIP_PLANS = [
  {
    id: "silver",
    name: "Silver Connect",
    badge: "Basic Value",
    duration: "3 Months",
    price: "₹2,499",
    originalPrice: "₹3,999",
    discount: "38% OFF",
    color: "from-slate-700 to-slate-900",
    borderColor: "border-slate-300",
    features: [
      "View 25 Verified Contact Numbers",
      "Send Unlimited Chat Messages",
      "Basic Horoscope Kundli Matching",
      "Profile Verified Badge"
    ]
  },
  {
    id: "gold",
    name: "Gold Royal VIP",
    badge: "Most Popular 🔥",
    duration: "6 Months",
    price: "₹4,999",
    originalPrice: "₹8,499",
    discount: "42% OFF",
    popular: true,
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-400",
    features: [
      "View 75 Verified Contact Numbers",
      "Direct Call & WhatsApp Access",
      "Unlimited Astrological Milan Reports",
      "Standout Top of Search Listing (5X)",
      "Priority Customer Support"
    ]
  },
  {
    id: "platinum",
    name: "Platinum Exclusive",
    badge: "VIP Elite 👑",
    duration: "12 Months",
    price: "₹7,999",
    originalPrice: "₹14,999",
    discount: "47% OFF",
    color: "from-orange-600 via-rose-600 to-amber-600",
    borderColor: "border-orange-500",
    features: [
      "Unlimited Verified Phone Numbers",
      "Dedicated Relationship Advisor",
      "Handpicked Matches every Friday",
      "Personalized Kundli Astrologer Session",
      "Complete Incognito & Photo Privacy"
    ]
  }
];
