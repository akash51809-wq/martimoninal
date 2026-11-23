import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyOtp: { userId: string; type: "mobile" | "email"; mobile?: string };
  ForgotPassword: undefined;
};

export type MainTabsParamList = {
  HomeTab: undefined;
  DiscoverTab: undefined;
  SearchTab: undefined;
  InterestsTab: undefined;
  ChatTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  ProfileDetail: { profileId: string; initialProfile?: any };
  EditProfile: { section?: "basic" | "religion" | "career" | "family" | "lifestyle" };
  PartnerPreferences: undefined;
  KundliMilan: { targetProfileId?: string };
  KycVerification: undefined;
  PrivacySettings: undefined;
  Membership: undefined;
  Support: undefined;
  Settings: undefined;
  ChatRoom: {
    threadId: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
  };
  ReportProfile: {
    targetUserId: string;
    targetUserName: string;
  };
};
