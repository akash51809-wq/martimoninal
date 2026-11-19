import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/data/mockData";
import { Heart, MapPin, Sparkles, Eye, Trash2 } from "lucide-react";

interface MobileLikedSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  likedProfiles: ProfileData[];
  onViewProfile: (profile: ProfileData) => void;
  onRemoveLike: (profile: ProfileData) => void;
  onOpenRegister: () => void;
}

export const MobileLikedSheet: React.FC<MobileLikedSheetProps> = ({
  open,
  onOpenChange,
  likedProfiles,
  onViewProfile,
  onRemoveLike,
  onOpenRegister,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl bg-[#FFFDF9] border-t border-amber-200 max-h-[82vh] flex flex-col p-0"
      >
        {/* Drag handle bar */}
        <div className="pt-3 pb-1 flex justify-center">
          <span className="w-12 h-1.5 rounded-full bg-amber-300/70" />
        </div>

        <SheetHeader className="px-5 pb-3 border-b border-amber-100 text-left">
          <SheetTitle className="font-serif-royal text-xl font-bold text-[#2B120C] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#EA580C] fill-current" />
            Sent Interests ({likedProfiles.length})
          </SheetTitle>
          <SheetDescription className="text-sm text-[#5C4740]">
            Profiles you shortlisted on Vivah Kar Lo
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {likedProfiles.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-[#EA580C]">
                <Heart className="w-7 h-7" />
              </div>
              <p className="font-serif-royal text-lg font-bold text-[#2B120C]">
                No Shortlisted Profiles Yet
              </p>
              <p className="text-sm text-[#5C4740] max-w-xs mx-auto">
                Tap &ldquo;Send Interest&rdquo; on any profile card to save them
                here.
              </p>
            </div>
          ) : (
            likedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-amber-200/80 shadow-sm"
              >
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  className="w-16 h-16 rounded-xl object-cover object-top shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif-royal text-base font-bold text-[#2B120C] truncate">
                      {profile.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EA580C] shrink-0">
                      <Sparkles className="w-3 h-3" />
                      {profile.kundliScore}/36
                    </span>
                  </div>
                  <p className="text-xs text-[#5C4740] truncate">
                    {profile.age} Yrs • {profile.professionTag}
                  </p>
                  <p className="text-xs text-[#785C52] flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-[#EA580C] shrink-0" />
                    {profile.city}, {profile.state}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      onViewProfile(profile);
                    }}
                    className="h-8 px-3 rounded-lg bg-saffron-gradient text-white text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveLike(profile)}
                    className="h-7 px-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-amber-100 bg-white">
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onOpenRegister();
            }}
            className="w-full h-11 rounded-xl bg-saffron-gradient text-white font-semibold text-sm shadow-saffron-sm"
          >
            Register Free to Connect &amp; Chat
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
