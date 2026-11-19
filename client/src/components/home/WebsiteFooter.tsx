import React from "react";
import { Link } from "wouter";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { POPULAR_CATEGORIES } from "@/data/homepageData";
import { Mail, Phone, MapPin, ShieldCheck, Smartphone } from "lucide-react";

interface WebsiteFooterProps {
  onOpenAuth: (tab: "login" | "register") => void;
  onSelectCommunityFilter: (community: string) => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onOpenAuth,
  onSelectCommunityFilter,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B090D] text-amber-100/85 border-t border-amber-400/20 pb-20 md:pb-0">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <VivahBrandLogo size="lg" darkBg={true} />
            <p className="text-sm sm:text-[15px] text-amber-100/75 leading-relaxed">
              Vivah Kar Lo connects verified Indian &amp; global NRI
              families with dignity, 36-Guna Vedic Kundli matching, and
              uncompromising privacy.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-amber-300/20 text-xs font-semibold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              100% Govt. ID Screened Platform
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-serif-royal text-base font-bold uppercase tracking-wider text-amber-300">
              Matrimony Platform
            </h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <a
                  href="#discover"
                  className="hover:text-amber-300 transition-colors"
                >
                  Discover Verified Matches
                </a>
              </li>
              <li>
                <a
                  href="#journey"
                  className="hover:text-amber-300 transition-colors"
                >
                  How Kundli Matching Works
                </a>
              </li>
              <li>
                <a
                  href="#stories"
                  className="hover:text-amber-300 transition-colors"
                >
                  Couple Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#membership"
                  className="hover:text-amber-300 transition-colors"
                >
                  VIP Membership Plans
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth("register")}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Register Free Profile
                </button>
              </li>
              <li>
                <Link
                  href="/mobile"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors font-medium"
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile App UI Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities */}
          <div className="space-y-4">
            <h4 className="font-serif-royal text-base font-bold uppercase tracking-wider text-amber-300">
              Popular Communities
            </h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CATEGORIES.communities.slice(0, 8).map((comm) => (
                <button
                  key={comm}
                  type="button"
                  onClick={() => onSelectCommunityFilter(comm)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-amber-200/15 text-sm transition-colors"
                >
                  {comm}
                </button>
              ))}
            </div>
          </div>

          {/* Concierge Contact */}
          <div className="space-y-4">
            <h4 className="font-serif-royal text-base font-bold uppercase tracking-wider text-amber-300">
              Family Helpdesk
            </h4>
            <ul className="space-y-3 text-sm sm:text-[15px] text-amber-100/80">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 9176 400 700 (9 AM – 9 PM IST)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@vivahkarlo.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex, Mumbai, Maharashtra 400051</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-amber-200/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-amber-100/65">
          <p>© {year} Vivah Kar Lo. Crafted for Trusted Indian Alliances.</p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-amber-300 transition-colors">
              About Us
            </Link>
            <a href="#trust" className="hover:text-amber-300 transition-colors">
              Privacy &amp; Security
            </a>
            <Link href="/mobile" className="hover:text-amber-300 transition-colors">
              Mobile UI
            </Link>
            <Link href="/admin" className="hover:text-amber-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
