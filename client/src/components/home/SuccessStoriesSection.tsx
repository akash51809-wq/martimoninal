import React from "react";
import { SUCCESS_STORIES } from "@/data/homepageData";
import { Heart, MapPin, Quote, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const SuccessStoriesSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section
      id="stories"
      className="py-16 sm:py-20 bg-[#FFFDF9] border-b border-amber-100"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2.5">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-[#EA580C]">
            <Heart className="w-4 h-4 fill-current" />
            Real Couples • Real Blessings
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B120C]">
            {t("home.stories.title", "Millions of Hearts, Timeless Stories")}
          </h2>
          <p className="text-base sm:text-lg text-[#5C4740]">
            {t("home.stories.subtitle", "Discover how families across India found lifelong harmony through verified introductions on Vivah Kar Lo.")}
          </p>
        </div>

        <div className="flex md:grid overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 no-scrollbar md:mx-0 md:px-0 md:pb-0 md:grid-cols-3 md:gap-6 lg:gap-8">
          {SUCCESS_STORIES.map((story) => (
            <article
              key={story.id}
              className="w-[84vw] max-w-[360px] md:w-auto md:max-w-none shrink-0 snap-center bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-[0_12px_36px_-15px_rgba(124,45,18,0.12)] flex flex-col group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#2C0914]">
                <img
                  src={story.image}
                  alt={story.couple}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#240710]/80 via-transparent to-transparent" />
                <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#3B0A18] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  {story.tag}
                </span>
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <h3 className="font-serif-royal text-xl font-bold">
                    {story.couple}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {story.location} • {story.marriedDate}
                  </p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/30">
                <div className="space-y-2.5">
                  <Quote className="w-6 h-6 text-amber-400" />
                  <p className="text-[15px] sm:text-base text-[#4E342E] leading-relaxed italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
