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
  MapPin,
  Smartphone,
  ExternalLink,
  Shield,
  Clock,
  RefreshCw,
} from "lucide-react";

interface AdminPhotoModerationTabProps {
  onLogAction?: (action: string, target: string) => void;
}

interface PhotoGeoAuditEntry {
  id: string;
  userId: string;
  photoUrl: string;
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  deviceMake?: string;
  deviceModel?: string;
  capturedAt?: string;
  sanitizedAt: string;
  fileSizeBytes: number;
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
  const [activeView, setActiveView] = useState<"queue" | "geo-vault">("queue");
  const [geoAudits, setGeoAudits] = useState<PhotoGeoAuditEntry[]>([]);
  const [loadingGeoAudits, setLoadingGeoAudits] = useState<boolean>(false);

  const loadGeoAudits = async () => {
    setLoadingGeoAudits(true);
    try {
      const res = await fetch("/api/v1/security/photo/geo-audits");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.audits)) {
          setGeoAudits(data.audits);
        }
      }
    } catch {
      // Failed to load audits
    } finally {
      setLoadingGeoAudits(false);
    }
  };

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
      </div>

      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setActiveView("queue")}
            className={`h-9 px-4 rounded-xl text-xs font-bold transition-all ${
              activeView === "queue"
                ? "bg-[#800020] text-white shadow-xs"
                : "bg-white text-[#5C4740] border border-amber-200 hover:bg-amber-100/50"
            }`}
          >
            <Camera className="w-4 h-4 mr-1.5" />
            Photo Moderation Queue ({photos.length})
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setActiveView("geo-vault");
              loadGeoAudits();
            }}
            className={`h-9 px-4 rounded-xl text-xs font-bold transition-all ${
              activeView === "geo-vault"
                ? "bg-[#800020] text-white shadow-xs"
                : "bg-white text-[#5C4740] border border-amber-200 hover:bg-amber-100/50"
            }`}
          >
            <MapPin className="w-4 h-4 mr-1.5 text-rose-500" />
            EXIF GPS Geo-Audit Vault
            {geoAudits.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[10px] rounded-full font-bold">
                {geoAudits.length}
              </span>
            )}
          </Button>
        </div>

        {activeView === "queue" && (
          /* Filter Pills */
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-amber-100/60 border border-amber-200/80 self-start sm:self-auto">
            {["all", "pending", "approved", "rejected", "blurred"].map((st) => (
              <Button
                key={st}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFilterStatus(st)}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold capitalize ${
                  filterStatus === st
                    ? "bg-white text-[#2B120C] shadow-xs"
                    : "text-[#5C4740] hover:text-[#2B120C]"
                }`}
              >
                {st}
              </Button>
            ))}
          </div>
        )}

        {activeView === "geo-vault" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadGeoAudits}
            disabled={loadingGeoAudits}
            className="h-8 px-3 rounded-xl text-xs font-semibold border-amber-200 bg-white hover:bg-amber-50 text-[#5C4740]"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingGeoAudits ? "animate-spin" : ""}`} />
            Refresh GPS Vault
          </Button>
        )}
      </div>

      {/* VIEW 1: Photo Queue Grid */}
      {activeView === "queue" && (
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
      )}

      {/* VIEW 2: EXIF GPS Geo-Audit Vault */}
      {activeView === "geo-vault" && (
        <div className="space-y-4">
          {/* Security Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2B120C]">
                Sharp EXIF Metadata Sanitizer &amp; GPS Forensics Vault
              </h4>
              <p className="text-xs text-[#5C4740] mt-0.5 leading-relaxed">
                When members upload photos, our server-side Sharp pipeline strips all camera EXIF metadata, GPS latitude/longitude, and hardware serials before public serving to protect member homes from stalking. The original GPS telemetry is archived here in the Admin Vault for Trust &amp; Safety investigations and duplicate device fraud detection.
              </p>
            </div>
          </div>

          {loadingGeoAudits ? (
            <div className="p-12 text-center text-[#8C6D62] bg-white rounded-2xl border border-amber-200/80">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-amber-600" />
              Loading EXIF GPS Audit Logs...
            </div>
          ) : geoAudits.length === 0 ? (
            <div className="p-12 text-center text-[#8C6D62] bg-white rounded-2xl border border-amber-200/80">
              No photo uploads with EXIF telemetry recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {geoAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-100 shrink-0 border border-amber-200">
                        {audit.photoUrl ? (
                          <img
                            src={audit.photoUrl}
                            alt={audit.userId}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-800">
                            IMG
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#2B120C] flex items-center gap-1.5">
                          {audit.userId}
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
                          >
                            EXIF Stripped
                          </Badge>
                        </div>
                        <div className="text-[11px] text-[#8C6D62]">
                          ID: {audit.id}
                        </div>
                      </div>
                    </div>

                    {audit.hasGps && audit.latitude && audit.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${audit.latitude},${audit.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                      >
                        <MapPin className="w-3 h-3 text-rose-500" />
                        View Map
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    <div>
                      <span className="text-[#8C6D62] text-[10px] uppercase font-bold block">
                        GPS Coordinates
                      </span>
                      {audit.hasGps && audit.latitude && audit.longitude ? (
                        <span className="font-semibold text-[#2B120C]">
                          {audit.latitude.toFixed(6)}, {audit.longitude.toFixed(6)}
                          {audit.altitude ? ` (${audit.altitude}m)` : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No GPS Tags</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[#8C6D62] text-[10px] uppercase font-bold block">
                        Device / Camera
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-[#2B120C] truncate">
                        <Smartphone className="w-3 h-3 text-amber-600 shrink-0" />
                        {audit.deviceMake || audit.deviceModel
                          ? `${audit.deviceMake || ""} ${audit.deviceModel || ""}`.trim()
                          : "Unknown Device"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#8C6D62] text-[10px] uppercase font-bold block">
                        Captured At
                      </span>
                      <span className="text-[#5C4740] text-[11px]">
                        {audit.capturedAt
                          ? new Date(audit.capturedAt).toLocaleString()
                          : "Unknown"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8C6D62] text-[10px] uppercase font-bold block">
                        Sanitized At
                      </span>
                      <span className="text-[#5C4740] text-[11px]">
                        {audit.sanitizedAt
                          ? new Date(audit.sanitizedAt).toLocaleString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8C6D62] pt-1">
                    <span>
                      File Size: {Math.round((audit.fileSizeBytes || 0) / 1024)} KB
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Public URL Safe (Zero Metadata)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
