import React, { useRef } from "react";
import type {
  Step6PhotosBioData,
  PhotoPrivacyOption,
} from "@/types/matrimonialProfileTypes";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image, Shield, Wand2, Trash2, CheckCircle2 } from "lucide-react";

interface Step6Props {
  data: Partial<Step6PhotosBioData>;
  onChange: (updates: Partial<Step6PhotosBioData>) => void;
}

const PRESET_AVATARS = [
  { url: "/2.jpg", label: "Smart Professional" },
  { url: "/1.jpg", label: "Traditional Elegant" },
  { url: "/3.jpg", label: "Contemporary Chic" },
];

const PRIVACY_OPTIONS: { id: PhotoPrivacyOption; label: string; desc: string }[] = [
  {
    id: "Visible to All",
    label: "Visible to All Members",
    desc: "Your photos will be visible to all verified registered matrimonial members.",
  },
  {
    id: "Visible to Connected Members Only",
    label: "Connected Members Only",
    desc: "Photos unlock only after you accept an Express Interest / Connect request.",
  },
  {
    id: "Blurred (Unlock on Request)",
    label: "Blurred (Unlock on Request)",
    desc: "Photos appear gently blurred; members must request access before viewing.",
  },
];

const BIO_TEMPLATES = [
  {
    title: "Modern & Cultured",
    text: "I am a progressive yet family-rooted professional who values mutual respect, open communication, and cultural traditions. In my free time, I love travelling, exploring new cuisines, and spending quality time with loved ones. Looking for an ambitious, compassionate partner to share life's adventures with.",
  },
  {
    title: "Ambitious & Caring",
    text: "Passionate about my career and deeply committed to family harmony. I appreciate intellectual conversations, humor, and a balanced lifestyle. Seeking a genuine, forward-thinking life partner who believes in mutual growth, understanding, and shared responsibilities.",
  },
  {
    title: "Simple & Down-to-Earth",
    text: "Raised with strong values of humility and honesty. I enjoy a simple, joyful life filled with music, reading, and weekend getaways. Looking for a warm-hearted, caring companion with whom I can build a happy, serene, and fulfilling married life.",
  },
];

export const Step6PhotoBioPrivacy: React.FC<Step6Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const primaryPhoto = data.primaryPhotoUrl || "/2.jpg";
  const gallery = data.galleryPhotoUrls || ["/1.jpg"];
  const currentPrivacy = data.photoPrivacy || "Visible to All";
  const currentBio = data.bio || "";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          if (isPrimary) {
            onChange({ primaryPhotoUrl: reader.result });
          } else {
            onChange({ galleryPhotoUrls: [...gallery, reader.result].slice(0, 5) });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    onChange({
      galleryPhotoUrls: gallery.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#EA580C]" />
          Step 6: Photo Album, Bio &amp; Privacy Controls
        </h2>
        <p className="text-sm text-[#5C4740] mt-1">
          Profiles with verified photos receive up to 8x more relevant alliance responses.
        </p>
      </div>

      {/* Primary Photo Section */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-white">
              <img
                src={primaryPhoto}
                alt="Primary Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow">
              Primary Photo
            </span>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h3 className="font-bold text-base text-[#2B120C]">
              Main Profile Photo <span className="text-rose-500">*</span>
            </h3>
            <p className="text-xs text-[#5C4740]">
              Upload a clear, front-facing portrait or pick one of the verified sample photos below.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, true)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-gradient text-white text-xs font-semibold shadow-sm hover:opacity-95"
              >
                <Camera className="w-3.5 h-3.5" />
                Upload Photo from Device
              </button>

              <div className="flex items-center gap-1.5 pl-2">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange({ primaryPhotoUrl: av.url })}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                      primaryPhoto === av.url
                        ? "border-[#EA580C] ring-2 ring-[#EA580C]/30 scale-105"
                        : "border-amber-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Gallery Photos */}
        <div className="pt-3 border-t border-amber-200/60 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-[#4E342E] uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-[#EA580C]" />
              Additional Gallery Photos ({gallery.length}/4)
            </Label>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, false)}
            />
            {gallery.length < 4 && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="text-xs font-semibold text-[#EA580C] hover:underline"
              >
                + Add Photo
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {gallery.map((photoUrl, index) => (
              <div
                key={index}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-amber-200 group bg-white shadow-sm"
              >
                <img
                  src={photoUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryPhoto(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Privacy Settings */}
      <div className="space-y-3 pt-1">
        <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#EA580C]" />
          Photo Privacy Setting <span className="text-rose-500">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRIVACY_OPTIONS.map((item) => {
            const isSelected = currentPrivacy === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ photoPrivacy: item.id })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-amber-100/90 border-[#EA580C] shadow-sm"
                    : "bg-white border-amber-200 hover:bg-amber-50/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#2B120C]">
                    {item.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />
                  )}
                </div>
                <p className="text-[11px] text-[#5C4740] leading-snug">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Bio / About Me */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Label className="text-sm font-semibold text-[#2B120C]">
            About Myself / Bio <span className="text-rose-500">*</span>
          </Label>
          <span className="text-xs text-[#8C6D62]">
            {currentBio.length} characters (min 20 recommended)
          </span>
        </div>

        {/* 1-Click Smart Bio Starters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#EA580C] flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" />
            Quick Templates:
          </span>
          {BIO_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange({ bio: tmpl.text })}
              className="px-2.5 py-1 rounded-lg bg-amber-100/80 hover:bg-orange-100 border border-amber-200 text-xs font-medium text-[#3B0A18] transition-colors"
            >
              {tmpl.title}
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Share a glimpse of your personality, values, education, lifestyle, and what you are looking for in your ideal life partner..."
          value={currentBio}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={5}
          className="rounded-2xl border-amber-200 text-sm leading-relaxed"
        />
      </div>
    </div>
  );
};
