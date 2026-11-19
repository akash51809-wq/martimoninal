import React, { useState } from "react";
import {
  INITIAL_PHOTO_MODERATION_QUEUE,
  type PhotoModerationItem,
} from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Camera,
  CheckCircle2,
  XCircle,
  EyeOff,
  Search,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Star,
  Zap,
  Filter,
} from "lucide-react";

interface AdminPhotoModerationTabProps {
  onLogAction?: (action: string, target: string) => void;
}

export const AdminPhotoModerationTab: React.FC<AdminPhotoModerationTabProps> = ({
  onLogAction,
}) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PhotoModerationItem[]>(
    INITIAL_PHOTO_MODERATION_QUEUE
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [inspectPhoto, setInspectPhoto] = useState<PhotoModerationItem | null>(null);

  const filteredPhotos = photos.filter((p) => {
    if (filterStatus === "all") return true;
    return p.status.toLowerCase() === filterStatus;
  });

  const handleUpdateStatus = (
    id: string,
    status: PhotoModerationItem["status"],
    userName: string
  ) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    onLogAction?.(`Photo Moderation: ${status}`, `${userName} (Photo ID: ${id})`);
    toast({
      title: `Photo ${status}`,
      description: `Moderation verdict recorded for ${userName}.`,
    });
    setInspectPhoto(null);
  };

  const handleQuarantineFake = (userId: string, userName: string) => {
    onLogAction?.("Quarantined Suspected Fake Profile", `${userName} (${userId})`);
    toast({
      title: "Profile Quarantined as Fake / Bot",
      description: `${userName} has been shadowbanned and removed from public discovery feeds.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#2B120C]">
                Photo Approval &amp; Fake Profile Defense Desk
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4740]">
                Review member portraits, detect AI-generated/celebrity fakes, enforce watermark guards, and approve biodatas
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-amber-100/60 border border-amber-200/80 self-start sm:self-auto">
          {["all", "pending", "approved", "rejected", "blurred"].map((st) => (
            <Button
              key={st}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFilterStatus(st)}
              className={`h-8 px-3 rounded-xl text-xs font-bold capitalize ${
                filterStatus === st
                  ? "bg-white text-[#2B120C] shadow-xs"
                  : "text-[#5C4740] hover:text-[#2B120C]"
              }`}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Photo Queue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPhotos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#8C6D62] bg-white rounded-2xl border border-amber-200/80">
            No photos found in the queue for the "{filterStatus}" filter.
          </div>
        ) : (
          filteredPhotos.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-4 bg-white border border-amber-200/80 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div className="space-y-2">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-amber-100 bg-amber-50">
                  <img
                    src={item.photoUrl}
                    alt={item.userName}
                    className={`w-full h-full object-cover transition-all ${
                      item.status === "Blurred" ? "blur-md" : ""
                    }`}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold shadow-xs ${
                        item.status === "Approved"
                          ? "bg-emerald-100/90 text-emerald-900 border-emerald-300"
                          : item.status === "Pending"
                          ? "bg-amber-100/90 text-amber-900 border-amber-300"
                          : item.status === "Blurred"
                          ? "bg-blue-100/90 text-blue-900 border-blue-300"
                          : "bg-rose-100/90 text-rose-900 border-rose-300"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    AI Face Score: {item.aiFaceConfidence}%
                  </div>
                </div>

                <div>
                  <h3 className="font-serif-royal font-bold text-[#2B120C] text-sm">
                    {item.userName}
                  </h3>
                  <p className="text-[11px] text-[#8C6D62]">
                    {item.photoType} • Submitted {item.submittedAt}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-amber-100 space-y-1.5">
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUpdateStatus(item.id, "Approved", item.userName)}
                    className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-0.5" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUpdateStatus(item.id, "Blurred", item.userName)}
                    className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                  >
                    <EyeOff className="w-3 h-3 mr-0.5" />
                    Blur
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUpdateStatus(item.id, "Rejected", item.userName)}
                    className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                  >
                    <XCircle className="w-3 h-3 mr-0.5" />
                    Reject
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuarantineFake(item.userId, item.userName)}
                  className="w-full h-7 text-[10px] text-rose-700 hover:bg-rose-50 rounded-lg font-bold"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Flag Fake Profile &amp; Quarantine
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
