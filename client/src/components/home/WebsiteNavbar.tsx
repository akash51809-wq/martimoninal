import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, Smartphone, Sparkles, Globe, ShieldCheck, ArrowRight, UserCheck, LogOut } from "lucide-react";
import { VivahBrandLogo } from "@/components/home/VivahBrandLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MOCK_LANGUAGES } from "@/data/mockData";
import {
  useAuthAccount,
  resolvePostLoginDestination,
} from "@/context/AuthAccountContext";
import { useLanguage, type SupportedLanguageCode } from "@/context/LanguageContext";

interface WebsiteNavbarProps {
  selectedLang?: string;
  onSelectLang?: (code: string) => void;
  onOpenAuth: (tab: "login" | "register") => void;
}

export const WebsiteNavbar: React.FC<WebsiteNavbarProps> = ({
  selectedLang,
  onSelectLang,
  onOpenAuth,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentAccount, logout } = useAuthAccount();
  const { lang, setLang, languages, t } = useLanguage();
  const accountDestination = currentAccount
    ? resolvePostLoginDestination(currentAccount)
    : "/login";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("home.nav.discover", "Discover Matches"), href: "#discover" },
    { label: t("home.nav.howItWorks", "How It Works"), href: "#journey" },
    { label: t("home.nav.stories", "Success Stories"), href: "#stories" },
    { label: t("home.nav.trust", "Trust & Safety"), href: "#trust" },
    { label: t("home.nav.membership", "Membership"), href: "#membership" },
  ];

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FFFDF9]/98 shadow-[0_8px_30px_rgba(120,53,15,0.08)] border-b border-amber-200/70"
          : "bg-[#FFFDF9]/95 border-b border-amber-100/80"
      }`}
    >
      {/* Top Heritage Micro-Strip */}
      <div className="hidden lg:block w-full bg-gradient-to-r from-[#3B0A18] via-[#5B1325] to-[#3B0A18] text-amber-100/95 text-xs sm:text-[13px] py-2 px-6 lg:px-10 xl:px-14 2xl:px-20">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              100% Govt. ID &amp; Selfie Verified Profiles
            </span>
            <span className="text-amber-500/40">|</span>
            <span>Free 36-Guna Vedic Kundli Compatibility</span>
          </div>
          <div className="flex items-center gap-4">
            <span>24×7 Family Concierge: +91 9176 400 700</span>
            <span className="text-amber-500/40">|</span>
            <Link
              href="/mobile"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors font-semibold"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Preview Mobile App UI
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 h-[72px] sm:h-[84px] lg:h-[92px] flex items-center justify-between gap-3">
        {/* Brand */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <VivahBrandLogo size="md" />
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-[15px] xl:text-base font-semibold text-[#3E2723] hover:text-[#EA580C] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#FF7700] after:to-[#F59E0B] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50/90 border border-amber-200/80 text-sm font-medium text-[#5C4033]">
            <Globe className="w-4 h-4 text-[#EA580C]" />
            <select
              aria-label="Select Language"
              value={lang}
              onChange={(e) => {
                const nextCode = e.target.value as SupportedLanguageCode;
                setLang(nextCode);
                if (onSelectLang) onSelectLang(nextCode);
              }}
              className="bg-transparent focus:outline-none cursor-pointer pr-1 text-sm font-semibold"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel || l.label}
                </option>
              ))}
            </select>
          </div>

          {currentAccount ? (
            <div className="flex items-center gap-2">
              <Link href={accountDestination}>
                <Button className="bg-saffron-gradient hover:opacity-95 text-white font-semibold rounded-full px-4 sm:px-5 h-11 text-sm sm:text-[15px] shadow-saffron-sm">
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  <span className="max-w-[110px] truncate">
                    {currentAccount.user.fullName.split(" ")[0]}
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                aria-label="Logout"
                className="hidden sm:inline-flex rounded-full border-amber-300 text-[#3B0A18] hover:bg-orange-50 h-11 w-11"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => onOpenAuth("login")}
                className="hidden sm:inline-flex text-[15px] font-semibold text-[#3B0A18] hover:text-[#EA580C] hover:bg-orange-50/80 rounded-full px-4 h-11"
              >
                {t("home.nav.login", "Sign In")}
              </Button>

              <Button
                onClick={() => onOpenAuth("register")}
                className="bg-saffron-gradient hover:opacity-95 text-white font-semibold rounded-full px-5 sm:px-6 h-11 text-sm sm:text-[15px] shadow-saffron-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {t("home.nav.register", "Register Free")}
              </Button>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden rounded-full border-amber-200 bg-white hover:bg-orange-50 text-[#3B0A18]"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#FFFDF9] border-l border-amber-200">
              <SheetHeader className="text-left pb-4 border-b border-amber-100">
                <SheetTitle>
                  <VivahBrandLogo size="sm" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center justify-between w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-[#3E2723] hover:bg-orange-50 hover:text-[#EA580C] transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}

                <div className="my-3 border-t border-amber-100" />

                {/* Mobile Language Selector */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-sm font-medium text-[#5C4033]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#EA580C]" />
                    <span>Language</span>
                  </div>
                  <select
                    aria-label="Select Language Mobile"
                    value={lang}
                    onChange={(e) => {
                      const nextCode = e.target.value as SupportedLanguageCode;
                      setLang(nextCode);
                      if (onSelectLang) onSelectLang(nextCode);
                    }}
                    className="bg-transparent focus:outline-none cursor-pointer text-sm font-semibold"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.nativeLabel || l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Link
                  href="/mobile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200/80"
                >
                  <Smartphone className="w-4 h-4 text-[#EA580C]" />
                  Open Mobile App UI
                </Link>

                {currentAccount ? (
                  <div className="grid grid-cols-2 gap-2.5 mt-4">
                    <Link href={accountDestination} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-saffron-gradient text-white">
                        <UserCheck className="w-4 h-4 mr-1.5" />
                        Account
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="rounded-xl border-amber-300 text-[#3B0A18]"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth("login");
                      }}
                      className="rounded-xl border-amber-300 text-[#3B0A18]"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth("register");
                      }}
                      className="rounded-xl bg-saffron-gradient text-white"
                    >
                      Register Free
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
