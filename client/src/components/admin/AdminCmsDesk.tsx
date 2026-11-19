import React, { useState } from "react";
import { SUCCESS_STORIES } from "@/data/homepageData";
import {
  INITIAL_CMS_BANNERS,
  INITIAL_CMS_FAQS,
  type CmsBanner,
  type CmsFaqItem,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Image as ImageIcon,
  HelpCircle,
  FileText,
  Globe,
  Plus,
  Pencil,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface AdminCmsDeskProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminCmsDesk: React.FC<AdminCmsDeskProps> = ({ onLogAction }) => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<
    "banners" | "stories" | "faqs" | "policies" | "seo"
  >("banners");

  // Banners State
  const [banners, setBanners] = useState<CmsBanner[]>(INITIAL_CMS_BANNERS);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState<Partial<CmsBanner>>({
    title: "",
    subtitle: "",
    imageUrl: "/hero_couple.jpg",
    ctaText: "Register Free",
    ctaUrl: "/register",
    active: true,
    order: 1,
  });

  // Stories State
  const [stories, setStories] = useState(SUCCESS_STORIES);
  const [publishedStoryIds, setPublishedStoryIds] = useState<string[]>(
    SUCCESS_STORIES.map((s) => s.id)
  );

  // FAQs State
  const [faqs, setFaqs] = useState<CmsFaqItem[]>(INITIAL_CMS_FAQS);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState<Partial<CmsFaqItem>>({
    question: "",
    answer: "",
    category: "General",
    order: 1,
    active: true,
  });

  // Policies State
  const [privacyPolicy, setPrivacyPolicy] = useState(
    `At Vivah Kar Lo, we hold member privacy and biodata confidentiality in the highest sacred regard. All phone numbers and personal contact information are strictly protected by dual-factor access gates. We never sell, lease, or monetize member personal data to unauthorized third-party commercial marketing platforms.`
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    `By accessing Vivah Kar Lo services, you certify that you are of legal marriageable age (21 years for men, 18 years for women under Indian Law) and that all personal information, horoscope details, and education credentials uploaded are authentic and verified.`
  );
  const [refundPolicy, setRefundPolicy] = useState(
    `We offer a 100% satisfaction guarantee. If our verified matchmaking desk fails to deliver legitimate contact reveals or matchmaking services within 30 days of active Gold or Platinum VIP subscription, you are entitled to a full prompt refund upon request.`
  );

  // SEO State
  const [seoMeta, setSeoMeta] = useState({
    title: "Vivah Kar Lo - India's Most Trusted Sacred Matrimony & Kundli Matchmaking",
    description: "Connect with 50,000+ verified Hindu, Marathi, Gujarati & Maratha alliances. 100% ID verified biodatas, accurate 36-Guna Kundli Milan, and priority matchmaking.",
    keywords: "matrimony, marriage bureau, vivah kar lo, kundli matching, marathi matrimony, gujarati matrimony, shaadi",
    ogImage: "https://vivahkarlo.in/og-preview.jpg",
    canonicalUrl: "https://vivahkarlo.in",
  });

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title) return;

    const newBanner: CmsBanner = {
      id: `ban-${Date.now()}`,
      title: bannerForm.title || "",
      subtitle: bannerForm.subtitle || "",
      imageUrl: bannerForm.imageUrl || "/hero_couple.jpg",
      ctaText: bannerForm.ctaText || "Explore Alliances",
      ctaUrl: bannerForm.ctaUrl || "/matches",
      active: bannerForm.active ?? true,
      order: Number(bannerForm.order) || 1,
    };
    setBanners((prev) => [...prev, newBanner]);
    onLogAction?.("Added Homepage Hero Banner", newBanner.title);
    toast({ title: "Hero Banner Published" });
    setBannerModalOpen(false);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    const newFaq: CmsFaqItem = {
      id: `faq-${Date.now()}`,
      question: faqForm.question,
      answer: faqForm.answer,
      category: faqForm.category || "General",
      order: faqs.length + 1,
      active: true,
    };
    setFaqs((prev) => [...prev, newFaq]);
    onLogAction?.("Added FAQ Item", newFaq.question);
    toast({ title: "FAQ Added to Knowledge Base" });
    setFaqModalOpen(false);
  };

  const handleSavePolicies = () => {
    onLogAction?.("Updated Legal Policies", "Privacy, Terms & Refund Policy");
    toast({
      title: "Legal Policies Saved",
      description: "Privacy Policy, Terms of Service, and Refund Policy updated live.",
    });
  };

  const handleSaveSeo = () => {
    onLogAction?.("Updated Website SEO Metadata", seoMeta.title);
    toast({
      title: "SEO Metadata Updated",
      description: "Title, meta description, OpenGraph preview, and canonical tags saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                CMS &amp; Website Content Command
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Control homepage hero banners, couple success stories, legal disclosures, FAQs, and search engine SEO
              </p>
            </div>
          </div>
        </div>

        {/* Subtab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-amber-100/60 border border-amber-200/80 self-start sm:self-auto overflow-x-auto">
          {[
            { id: "banners", label: "Hero Banners", icon: ImageIcon },
            { id: "stories", label: "Success Stories", icon: Sparkles },
            { id: "faqs", label: "FAQ Center", icon: HelpCircle },
            { id: "policies", label: "Legal Policies", icon: FileText },
            { id: "seo", label: "SEO & Meta", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`h-8 px-3 rounded-xl text-xs font-bold ${
                  activeSubTab === tab.id
                    ? "bg-white text-[#2B120C] shadow-xs"
                    : "text-[#5C4740] hover:text-[#2B120C]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 mr-1 text-[#EA580C]" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Subtab 1: Hero Banners */}
      {activeSubTab === "banners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Homepage Carousel &amp; Promotional Banners
            </h3>
            <Button
              type="button"
              onClick={() => setBannerModalOpen(true)}
              className="h-9 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Banner Slide
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl p-4 bg-white border border-amber-200/80 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-40 rounded-xl overflow-hidden bg-amber-50 relative">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      variant="outline"
                      className="absolute top-2 right-2 bg-black/60 text-white border-0 text-[10px]"
                    >
                      Slide #{b.order}
                    </Badge>
                  </div>
                  <h4 className="font-serif-royal font-bold text-base text-[#2B120C]">
                    {b.title}
                  </h4>
                  <p className="text-xs text-[#5C4740]">{b.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#EA580C]">
                    CTA: {b.ctaText} ({b.ctaUrl})
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setBanners((prev) => prev.filter((item) => item.id !== b.id))}
                    className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Success Stories */}
      {activeSubTab === "stories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stories.map((story) => {
            const isPub = publishedStoryIds.includes(story.id);
            return (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <img
                    src={story.image}
                    alt={story.couple}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                      {story.couple}
                    </h3>
                    <p className="text-xs font-semibold text-[#EA580C]">
                      {story.location} • {story.marriedDate}
                    </p>
                    <p className="text-xs text-[#5C4740] line-clamp-3">
                      {story.quote}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setPublishedStoryIds((prev) =>
                        prev.includes(story.id)
                          ? prev.filter((id) => id !== story.id)
                          : [...prev, story.id]
                      );
                      toast({ title: `Updated visibility for ${story.couple}` });
                    }}
                    className={`w-full h-9 rounded-xl text-xs font-semibold ${
                      isPub ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isPub ? "Published on Homepage ✓" : "Draft (Hidden)"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab 3: FAQs */}
      {activeSubTab === "faqs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Member Knowledge Base &amp; Frequently Asked Questions
            </h3>
            <Button
              type="button"
              onClick={() => setFaqModalOpen(true)}
              className="h-9 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add FAQ Question
            </Button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-2xl p-4 bg-white border border-amber-200/80 shadow-xs space-y-2 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                      {faq.category}
                    </Badge>
                    <h4 className="font-bold text-sm text-[#2B120C]">
                      {faq.question}
                    </h4>
                  </div>
                  <p className="text-xs text-[#5C4740] pl-1">{faq.answer}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFaqs((prev) => prev.filter((item) => item.id !== faq.id))}
                  className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Legal Policies */}
      {activeSubTab === "policies" && (
        <div className="space-y-5 bg-white rounded-3xl border border-amber-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                Platform Legal Disclosures &amp; Terms
              </h3>
              <p className="text-xs text-[#5C4740]">
                Edit live terms, user privacy policy, and subscription refund parameters
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSavePolicies}
              className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold h-9 px-4"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Legal Policies
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#2B120C]">Privacy Policy</Label>
              <Textarea
                rows={4}
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#2B120C]">Terms &amp; Conditions</Label>
              <Textarea
                rows={4}
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#2B120C]">Refund Policy</Label>
              <Textarea
                rows={3}
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: SEO & Meta */}
      {activeSubTab === "seo" && (
        <div className="space-y-5 bg-white rounded-3xl border border-amber-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-royal text-lg font-bold text-[#2B120C]">
                Search Engine Optimization (SEO) &amp; OpenGraph Settings
              </h3>
              <p className="text-xs text-[#5C4740]">
                Configure indexing meta titles, descriptions, and WhatsApp / Facebook sharing cards
              </p>
            </div>
            <Button
              type="button"
              onClick={handleSaveSeo}
              className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold h-9 px-4"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save SEO Meta
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#2B120C]">Meta Title (Max 60 chars)</Label>
                <Input
                  value={seoMeta.title}
                  onChange={(e) => setSeoMeta({ ...seoMeta, title: e.target.value })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#2B120C]">Meta Description (Max 160 chars)</Label>
                <Textarea
                  rows={3}
                  value={seoMeta.description}
                  onChange={(e) => setSeoMeta({ ...seoMeta, description: e.target.value })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#2B120C]">Keywords (Comma separated)</Label>
                <Input
                  value={seoMeta.keywords}
                  onChange={(e) => setSeoMeta({ ...seoMeta, keywords: e.target.value })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            {/* Google Search Preview Snippet */}
            <div className="rounded-2xl p-4 bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="text-[11px] font-bold text-[#8C6D62] uppercase tracking-wider block">
                Google Search Engine Result Snippet Preview
              </span>
              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-amber-200/80">
                <div className="text-[11px] text-[#202124] flex items-center gap-1.5">
                  <span className="font-semibold">{seoMeta.canonicalUrl}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer">
                  {seoMeta.title}
                </h4>
                <p className="text-xs text-[#4d5156] line-clamp-2">
                  {seoMeta.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      <Dialog open={bannerModalOpen} onOpenChange={setBannerModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Add Homepage Hero Banner
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveBanner} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Banner Title *</Label>
              <Input
                required
                value={bannerForm.title || ""}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="e.g. Find Your Perfect Sacred Match"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Subtitle</Label>
              <Input
                value={bannerForm.subtitle || ""}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                placeholder="e.g. Over 50,000+ verified alliances"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">CTA Button Text</Label>
                <Input
                  value={bannerForm.ctaText || "Register Free"}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2B120C]">CTA Target URL</Label>
                <Input
                  value={bannerForm.ctaUrl || "/register"}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaUrl: e.target.value })}
                  className="rounded-xl border-amber-200 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBannerModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
              >
                Add Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add FAQ Modal */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-amber-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-royal text-lg font-bold text-[#2B120C]">
              Add FAQ Question
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveFaq} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Category</Label>
              <select
                value={faqForm.category || "General"}
                onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value as any })}
                className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs bg-white text-[#2B120C]"
              >
                <option value="General">General</option>
                <option value="Security">Security</option>
                <option value="Membership">Membership</option>
                <option value="Kundli">Kundli</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Question *</Label>
              <Input
                required
                value={faqForm.question || ""}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="e.g. How do I verify my phone number?"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#2B120C]">Answer *</Label>
              <Textarea
                required
                rows={3}
                value={faqForm.answer || ""}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                placeholder="Enter detailed help answer"
                className="rounded-xl border-amber-200 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFaqModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold"
              >
                Save FAQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
