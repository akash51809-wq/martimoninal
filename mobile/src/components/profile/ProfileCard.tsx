import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Heart, MapPin, Briefcase, GraduationCap, Sparkles, Lock } from "lucide-react-native";
import { Colors } from "../../constants/colors";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export interface ProfileCardData {
  id: string;
  fullName: string;
  age: number;
  heightDisplay?: string;
  city: string;
  state: string;
  religion?: string;
  caste?: string;
  occupation?: string;
  highestDegree?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isKycVerified?: boolean;
  isVip?: boolean;
  matchScore?: number;
  isPhotoLocked?: boolean;
  isLiked?: boolean;
}

interface ProfileCardProps {
  profile: ProfileCardData;
  onViewDetails: (id: string) => void;
  onSendInterest: (id: string) => void;
  onToggleShortlist?: (id: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewDetails,
  onSendInterest,
  onToggleShortlist,
}) => {
  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onViewDetails(profile.id)}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: profile.avatarUrl || defaultAvatar }}
          style={[styles.avatar, profile.isPhotoLocked && styles.blurredAvatar]}
          resizeMode="cover"
        />

        {profile.isPhotoLocked && (
          <View style={styles.photoLockOverlay}>
            <Lock size={20} color={Colors.surface} />
            <Text style={styles.photoLockText}>Photo Visible on Request</Text>
          </View>
        )}

        <View style={styles.topBadgesRow}>
          {profile.matchScore ? (
            <Badge variant="match_score" score={profile.matchScore} />
          ) : null}

          {onToggleShortlist && (
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => onToggleShortlist(profile.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Heart
                size={18}
                color={profile.isLiked ? Colors.danger : Colors.textPrimary}
                fill={profile.isLiked ? Colors.danger : "transparent"}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.trustBadgesOverlay}>
          {profile.isKycVerified ? (
            <Badge variant="kyc_verified" />
          ) : profile.isVerified ? (
            <Badge variant="basic_verified" />
          ) : null}
          {profile.isVip ? <Badge variant="vip" /> : null}
        </View>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.fullName}, {profile.age}
          </Text>
        </View>

        {profile.heightDisplay && (
          <Text style={styles.subInfo}>{profile.heightDisplay}</Text>
        )}

        <View style={styles.infoRow}>
          <MapPin size={14} color={Colors.secondary} />
          <Text style={styles.infoText} numberOfLines={1}>
            {profile.city}, {profile.state}
          </Text>
        </View>

        {profile.religion && (
          <View style={styles.infoRow}>
            <Sparkles size={14} color={Colors.gold} />
            <Text style={styles.infoText} numberOfLines={1}>
              {profile.religion} {profile.caste ? `• ${profile.caste}` : ""}
            </Text>
          </View>
        )}

        {profile.occupation && (
          <View style={styles.infoRow}>
            <Briefcase size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {profile.occupation}
            </Text>
          </View>
        )}

        {profile.highestDegree && (
          <View style={styles.infoRow}>
            <GraduationCap size={14} color={Colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {profile.highestDegree}
            </Text>
          </View>
        )}

        <View style={styles.actionButtonsRow}>
          <Button
            title="View Profile"
            variant="outline"
            size="small"
            style={styles.outlineBtn}
            onPress={() => onViewDetails(profile.id)}
          />
          <Button
            title="Send Interest"
            variant="primary"
            size="small"
            style={styles.primaryBtn}
            icon={<Heart size={14} color={Colors.surface} fill={Colors.surface} />}
            onPress={() => onSendInterest(profile.id)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    height: 220,
    width: "100%",
    backgroundColor: Colors.surfaceMuted,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  blurredAvatar: {
    opacity: 0.15,
  },
  photoLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(43, 18, 12, 0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoLockText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  topBadgesRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeButton: {
    backgroundColor: Colors.surface,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  trustBadgesOverlay: {
    position: "absolute",
    bottom: 8,
    left: 10,
    flexDirection: "row",
    gap: 6,
  },
  detailsContainer: {
    padding: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  subInfo: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
  },
  primaryBtn: {
    flex: 1.2,
  },
});
