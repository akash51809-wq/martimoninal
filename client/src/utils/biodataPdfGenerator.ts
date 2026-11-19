import type { ProfileData } from "@/data/mockData";

/**
 * Strict HTML entity escaping to prevent XSS / script injection inside generated PDF windows.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getInitials(name: string): string {
  const parts = String(name || "VK")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "VK";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export interface SafeBiodataPayload {
  profileId: string;
  name: string;
  gender?: string;
  age: number;
  dob?: string;
  height: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste?: string;
  gotra?: string;
  motherTongue: string;
  rashi?: string;
  nakshatra?: string;
  manglik: string;
  kundliScore: number;
  education: string;
  college?: string;
  profession: string;
  company?: string;
  annualIncome: string;
  city: string;
  state: string;
  country?: string;
  verified: boolean;
  lifestyle?: {
    diet?: string;
    drink?: string;
    smoke?: string;
    hobbies?: string[];
  };
  bio?: string;
  photoIncluded: false;
  photoProtectionNotice: string;
  contactRedacted: boolean;
  contactDetails: {
    mobile: string;
    email: string;
    cityResidence: string;
    accessNote: string;
  } | null;
  redactionNotice: string | null;
  auditStamp: {
    viewerId: string;
    viewerTier: string;
    generatedAt: string;
  };
}

/**
 * Builds a strictly PII-free WhatsApp share URL (NEVER exposes phone, email, or home address).
 */
export function buildSafeWhatsAppShareUrl(
  profile: ProfileData,
  serverText?: string
): string {
  const safeText =
    serverText ||
    [
      `*Vivah Kar Lo — Verified Matrimonial Alliance*`,
      ``,
      `*Profile ID:* ${profile.profileId || profile.id}`,
      `*Name:* ${profile.name} (${profile.age} Yrs, ${profile.height})`,
      `*Community:* ${profile.religion} • ${profile.caste} • ${profile.motherTongue}`,
      `*Education:* ${profile.education}`,
      `*Career:* ${profile.profession} • ${profile.income}`,
      `*Location:* ${profile.city}, ${profile.state}`,
      `*Horoscope:* ${profile.rashi || "Verified"} • ${profile.manglik} (${profile.kundliScore}/36 Gunas)`,
      `*Verification:* ${profile.verified ? "Govt ID Verified ✓" : "Registered Member"}`,
      ``,
      `_Note: Photos & personal contact details are privacy-protected. View full verified profile securely on Vivah Kar Lo._`,
    ].join("\n");

  return `https://wa.me/?text=${encodeURIComponent(safeText)}`;
}

export type BiodataPdfTemplate = "classic_royal" | "modern_minimalist" | "vedic_traditional";

/**
 * Downloads a Royal Branded Matrimonial Biodata PDF with choice of 3 premium templates:
 *  - classic_royal: Traditional Burgundy & Gold with Royal Crest
 *  - modern_minimalist: Contemporary Slate & Emerald Corporate Aesthetic
 *  - vedic_traditional: Traditional Saffron & Vermilion with Sanskrit Invocations
 */
export async function downloadProtectedBiodataPdf(
  profile: ProfileData,
  viewerId: string,
  clientIsVip: boolean,
  template: BiodataPdfTemplate = "classic_royal"
): Promise<{ success: boolean; contactIncluded: boolean; message: string }> {
  let payload: SafeBiodataPayload | null = null;

  try {
    const res = await fetch(
      `/api/v1/profiles/${encodeURIComponent(profile.id)}/biodata-safe?viewerUserId=${encodeURIComponent(
        viewerId || ""
      )}`
    );
    const data = await res.json();
    if (res.ok && data.success && data.biodata) {
      payload = data.biodata;
    }
  } catch {
    // Offline fallback strictly enforces zero photo and zero contact for non-VIP
  }

  if (!payload) {
    payload = {
      profileId: profile.profileId || profile.id,
      name: profile.name,
      age: profile.age,
      height: profile.height,
      maritalStatus: profile.maritalStatus,
      religion: profile.religion,
      caste: profile.caste,
      subCaste: profile.subCaste,
      gotra: profile.gotra,
      motherTongue: profile.motherTongue,
      rashi: profile.rashi,
      nakshatra: profile.nakshatra,
      manglik: profile.manglik,
      kundliScore: profile.kundliScore,
      education: profile.education,
      college: profile.college,
      profession: profile.profession,
      annualIncome: profile.income,
      city: profile.city,
      state: profile.state,
      country: "India",
      verified: profile.verified,
      lifestyle: profile.lifestyle,
      bio: profile.bio,
      photoIncluded: false,
      photoProtectionNotice:
        "Profile photographs are strictly excluded from PDF downloads under Vivah Photo Shield™.",
      contactRedacted: !clientIsVip,
      contactDetails: null,
      redactionNotice:
        "Personal contact details (Mobile, WhatsApp, Email & Address) are strictly omitted from PDF for Free Plan users. Upgrade to VIP & request mutual permission.",
      auditStamp: {
        viewerId: viewerId || "guest",
        viewerTier: clientIsVip ? "VIP Member" : "Free Plan",
        generatedAt: new Date().toISOString(),
      },
    };
  }

  // Double safety barrier: Never allow contactDetails if contactRedacted is true
  const allowContact = !payload.contactRedacted && Boolean(payload.contactDetails);
  const initials = escapeHtml(getInitials(payload.name));

  const isVedic = template === "vedic_traditional";
  const isModern = template === "modern_minimalist";

  const bannerBg = isVedic
    ? "linear-gradient(135deg, #7C2D12 0%, #9A3412 50%, #EA580C 100%)"
    : isModern
    ? "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #065F46 100%)"
    : "linear-gradient(135deg, #3B0A18 0%, #6B142C 60%, #9A3412 100%)";

  const borderColor = isVedic ? "#B45309" : isModern ? "#059669" : "#D97706";
  const crestBg = isVedic
    ? "linear-gradient(135deg, #EA580C, #D97706)"
    : isModern
    ? "linear-gradient(135deg, #10B981, #047857)"
    : "linear-gradient(135deg, #F59E0B, #EA580C)";

  const brandTag = isVedic
    ? "|| SHREE GANESHAYA NAMAHA || • VEDIC PARASHARA BIODATA"
    : isModern
    ? "VERIFIED EXECUTIVE ALLIANCE DOSSIER • VIVAH CERTIFIED"
    : "VIVAH KAR LO • ROYAL MATRIMONIAL BIODATA";

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Matrimonial Biodata - ${escapeHtml(payload.name)} (${escapeHtml(payload.profileId)})</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: ${isModern ? "'Inter', 'Segoe UI', sans-serif" : "'Segoe UI', Georgia, serif"};
      background: ${isModern ? "#F8FAFC" : "#FAF5EE"};
      color: #2B120C;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .sheet {
      max-width: 780px;
      margin: 0 auto;
      background: #FFFDF9;
      border: 2px solid ${borderColor};
      border-radius: ${isModern ? "10px" : "18px"};
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(59, 10, 24, 0.12);
    }
    .banner {
      background: ${bannerBg};
      color: #FFFDF9;
      padding: 26px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .crest {
      width: 74px;
      height: 74px;
      border-radius: ${isModern ? "10px" : "18px"};
      background: ${crestBg};
      border: 2px solid #FDE68A;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
      color: #3B0A18;
      letter-spacing: 1px;
      flex-shrink: 0;
    }
    .brand-tag {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #FDE68A;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .name {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
    }
    .sub {
      margin: 5px 0 0;
      font-size: 13px;
      color: #FEF3C7;
    }
    .shield-bar {
      background: #FEF3C7;
      border-bottom: 1px solid #F59E0B;
      padding: 10px 30px;
      font-size: 11.5px;
      color: #7C2D12;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      font-weight: 600;
    }
    .body {
      padding: 24px 30px;
    }
    .section {
      margin-bottom: 20px;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      overflow: hidden;
      background: #FFFFFF;
    }
    .section-title {
      background: #FFFBEB;
      border-bottom: 1px solid #FDE68A;
      padding: 9px 16px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7C2D12;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    td {
      padding: 8px 16px;
      border-bottom: 1px solid #FEF3C7;
      vertical-align: top;
    }
    tr:last-child td { border-bottom: none; }
    td.label {
      width: 34%;
      color: #6E564E;
      font-weight: 600;
      background: #FFFDF9;
    }
    td.val {
      color: #2B120C;
      font-weight: 600;
    }
    .bio-box {
      padding: 12px 16px;
      font-size: 12.5px;
      line-height: 1.6;
      color: #3E2723;
    }
    .locked-contact {
      background: #FFF1F2;
      border: 1.5px dashed #E11D48;
      border-radius: 12px;
      padding: 16px 20px;
      color: #881337;
      font-size: 12.5px;
      margin-bottom: 18px;
    }
    .vip-contact {
      background: #ECFDF5;
      border: 1.5px solid #10B981;
      border-radius: 12px;
      padding: 14px 20px;
      color: #064E3B;
      font-size: 12.5px;
      margin-bottom: 18px;
    }
    .footer {
      background: #3B0A18;
      color: #FDE68A;
      padding: 14px 30px;
      font-size: 10.5px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .print-bar {
      text-align: center;
      margin: 18px auto 0;
      max-width: 780px;
    }
    .btn-print {
      background: linear-gradient(90deg, #EA580C, #D97706);
      color: #fff;
      border: none;
      padding: 11px 26px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .print-bar { display: none; }
      .sheet { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="banner">
      <div>
        <div class="brand-tag">${brandTag}</div>
        <h1 class="name">${escapeHtml(payload.name)}</h1>
        <p class="sub">
          Profile ID: ${escapeHtml(payload.profileId)} &nbsp;•&nbsp;
          ${escapeHtml(payload.age)} Years &nbsp;•&nbsp;
          ${escapeHtml(payload.height)} &nbsp;•&nbsp;
          ${escapeHtml(payload.city)}, ${escapeHtml(payload.state)}
        </p>
      </div>
      <div class="crest" title="Profile photo excluded under Vivah Photo Shield">${initials}</div>
    </div>

    <div class="shield-bar">
      <span>Vivah Photo Shield™: Profile Photographs Strictly Excluded from PDF</span>
      <span>${payload.verified ? "Govt ID Verified Profile ✓" : "Registered Member"}</span>
    </div>

    <div class="body">
      <div class="section">
        <div class="section-title">1. Personal &amp; Cultural Details</div>
        <table>
          <tr><td class="label">Full Name</td><td class="val">${escapeHtml(payload.name)}</td></tr>
          <tr><td class="label">Age &amp; Height</td><td class="val">${escapeHtml(payload.age)} Years • ${escapeHtml(payload.height)}</td></tr>
          <tr><td class="label">Marital Status</td><td class="val">${escapeHtml(payload.maritalStatus)}</td></tr>
          <tr><td class="label">Religion &amp; Caste</td><td class="val">${escapeHtml(payload.religion)} • ${escapeHtml(payload.caste)}${payload.subCaste ? ` (${escapeHtml(payload.subCaste)})` : ""}</td></tr>
          <tr><td class="label">Gotra &amp; Mother Tongue</td><td class="val">${escapeHtml(payload.gotra || "Not Specified")} • ${escapeHtml(payload.motherTongue)}</td></tr>
          <tr><td class="label">Current Location</td><td class="val">${escapeHtml(payload.city)}, ${escapeHtml(payload.state)}, ${escapeHtml(payload.country || "India")}</td></tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">2. Vedic Horoscope &amp; Astrological Profile</div>
        <table>
          <tr><td class="label">Rashi (Moon Sign)</td><td class="val">${escapeHtml(payload.rashi || "Available on Request")}</td></tr>
          <tr><td class="label">Nakshatra</td><td class="val">${escapeHtml(payload.nakshatra || "Available on Request")}</td></tr>
          <tr><td class="label">Manglik Status</td><td class="val">${escapeHtml(payload.manglik)}</td></tr>
          <tr><td class="label">Ashtakoot Kundli Match</td><td class="val">${escapeHtml(payload.kundliScore)} / 36 Gunas</td></tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">3. Education, Career &amp; Lifestyle</div>
        <table>
          <tr><td class="label">Highest Education</td><td class="val">${escapeHtml(payload.education)}${payload.college ? ` — ${escapeHtml(payload.college)}` : ""}</td></tr>
          <tr><td class="label">Profession / Occupation</td><td class="val">${escapeHtml(payload.profession)}</td></tr>
          <tr><td class="label">Annual Income</td><td class="val">${escapeHtml(payload.annualIncome)}</td></tr>
          <tr><td class="label">Diet &amp; Habits</td><td class="val">${escapeHtml(payload.lifestyle?.diet || "Vegetarian")} • Smoking: ${escapeHtml(payload.lifestyle?.smoke || "No")} • Drinking: ${escapeHtml(payload.lifestyle?.drink || "No")}</td></tr>
          <tr><td class="label">Hobbies &amp; Interests</td><td class="val">${escapeHtml((payload.lifestyle?.hobbies || []).join(", ") || "Family, Travel, Music")}</td></tr>
        </table>
      </div>

      ${
        payload.bio
          ? `<div class="section">
               <div class="section-title">4. About Candidate</div>
               <div class="bio-box">${escapeHtml(payload.bio)}</div>
             </div>`
          : ""
      }

      ${
        allowContact && payload.contactDetails
          ? `<div class="vip-contact">
               <strong>5. Verified Contact Details (VIP Authorized Access)</strong><br/><br/>
               Mobile / WhatsApp: <strong>${escapeHtml(payload.contactDetails.mobile)}</strong><br/>
               Email Address: <strong>${escapeHtml(payload.contactDetails.email)}</strong><br/>
               Location: <strong>${escapeHtml(payload.contactDetails.cityResidence)}</strong><br/>
               <small>${escapeHtml(payload.contactDetails.accessNote)}</small>
             </div>`
          : `<div class="locked-contact">
               <strong>5. Personal Contact Details — Restricted (Free Plan)</strong><br/><br/>
               ${escapeHtml(
                 payload.redactionNotice ||
                   "Personal contact details (Mobile Number, WhatsApp, Email & Residential Address) are strictly excluded for Free accounts. Upgrade to VIP & request mutual permission on Vivah Kar Lo."
               )}
             </div>`
      }
    </div>

    <div class="footer">
      <span>Vivah Kar Lo • Trusted Matrimony Platform</span>
      <span>Audit Viewer: ${escapeHtml(payload.auditStamp.viewerTier)} • Generated: ${escapeHtml(
        new Date(payload.auditStamp.generatedAt).toLocaleString()
      )}</span>
    </div>
  </div>

  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">Save / Download as PDF</button>
  </div>
  <script>
    window.addEventListener("load", function() {
      setTimeout(function() { window.print(); }, 350);
    });
  </script>
</body>
</html>`;

  const printWin = window.open("", "_blank", "noopener,noreferrer,width=900,height=1020");
  if (printWin) {
    printWin.document.open();
    printWin.document.write(htmlDoc);
    printWin.document.close();
  } else {
    // Fallback downloadable HTML file if popup blocker is active
    const blob = new Blob([htmlDoc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VivahKarLo_Biodata_${(payload.profileId || payload.name).replace(/[^a-zA-Z0-9_-]/g, "")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    success: true,
    contactIncluded: allowContact,
    message: allowContact
      ? "Protected Biodata PDF ready (No photo included; VIP contact verified)."
      : "Protected Biodata PDF ready (No photo & no personal contact details included for Free account).",
  };
}
