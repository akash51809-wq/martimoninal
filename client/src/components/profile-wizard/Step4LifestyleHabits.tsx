import React from "react";
import type {
  Step4LifestyleData,
  DietOption,
  HabitOption,
} from "@/types/matrimonialProfileTypes";
import { Label } from "@/components/ui/label";
import { Utensils, Coffee, Wine, Sparkles } from "lucide-react";

interface Step4Props {
  data: Partial<Step4LifestyleData>;
  onChange: (updates: Partial<Step4LifestyleData>) => void;
}

const DIET_OPTIONS: DietOption[] = [
  "Pure Vegetarian",
  "Vegetarian (Eggetarian)",
  "Non-Vegetarian",
  "Jain",
  "Vegan",
];

const HABIT_OPTIONS: HabitOption[] = ["No", "Occasionally", "Yes"];

const AVAILABLE_HOBBIES = [
  "Travelling & Trekking",
  "Reading & Literature",
  "Yoga & Meditation",
  "Gym & Fitness",
  "Cooking & Baking",
  "Photography",
  "Classical / Bollywood Music",
  "Watching Movies & Shows",
  "Writing / Blogging",
  "Playing Sports",
  "Pets & Animals",
  "Gardening & Nature",
  "Art & Painting",
  "Social Volunteering",
];

export const Step4LifestyleHabits: React.FC<Step4Props> = ({ data, onChange }) => {
  const currentHobbies = data.hobbies || [];

  const toggleHobby = (hobby: string) => {
    if (currentHobbies.includes(hobby)) {
      onChange({ hobbies: currentHobbies.filter((h) => h !== hobby) });
    } else {
      onChange({ hobbies: [...currentHobbies, hobby] });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2B120C] flex items-center gap-2">
          <Utensils className="w-5 h-5 text-[#EA580C]" />
          Step 4: Lifestyle &amp; Personal Habits
        </h2>
        <p className="text-sm text-[#5C4740] mt-1">
          Share your culinary preferences, habits, and passions to find a compatible daily life partner.
        </p>
      </div>

      <div className="space-y-5">
        {/* Diet Preference */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-[#EA580C]" />
            Dietary Habit <span className="text-rose-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DIET_OPTIONS.map((diet) => {
              const isSelected = (data.diet || "Pure Vegetarian") === diet;
              return (
                <button
                  key={diet}
                  type="button"
                  onClick={() => onChange({ diet })}
                  className={`p-3 text-xs sm:text-sm font-semibold rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-100/90 border-[#EA580C] text-[#3B0A18] font-bold shadow-sm"
                      : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50/70"
                  }`}
                >
                  {diet}
                </button>
              );
            })}
          </div>
        </div>

        {/* Smoking & Drinking Habits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Smoking */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#EA580C]" />
              Smoking Habit <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {HABIT_OPTIONS.map((opt) => {
                const isSelected = (data.smoking || "No") === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ smoking: opt })}
                    className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? "bg-amber-100 border-[#EA580C] text-[#3B0A18] font-bold shadow-sm"
                        : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drinking */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-[#EA580C]" />
              Drinking Habit <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {HABIT_OPTIONS.map((opt) => {
                const isSelected = (data.drinking || "No") === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ drinking: opt })}
                    className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? "bg-amber-100 border-[#EA580C] text-[#3B0A18] font-bold shadow-sm"
                        : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hobbies & Interests */}
        <div className="space-y-2 pt-2">
          <Label className="text-sm font-semibold text-[#2B120C] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
            Hobbies &amp; Interests (Select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {AVAILABLE_HOBBIES.map((hobby) => {
              const isSelected = currentHobbies.includes(hobby);
              return (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => toggleHobby(hobby)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                    isSelected
                      ? "bg-[#3B0A18] border-[#3B0A18] text-amber-200 font-bold shadow-sm"
                      : "bg-white border-amber-200 text-[#5C4740] hover:bg-amber-50"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {hobby}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
