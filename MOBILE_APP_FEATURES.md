# Mobile App Feature Inventory & Mapping Document

## Overview
This document catalogs every user-panel feature present in the Vivah Kar Lo Matrimonial web platform and maps it to its native mobile implementation in the React Native / Expo mobile application.

---

## 1. Authentication & Onboarding

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| User Sign In with Mobile/Email & Password | `AuthLoginScreen` | `POST /api/v1/auth/login` | Planned / Integrated |
| Atomic Registration with Validation | `AuthRegisterScreen` | `POST /api/v1/auth/register` | Planned / Integrated |
| Real-time Duplicate Mobile & Email Check | `AuthRegisterScreen` | `POST /api/v1/auth/check-duplicate` | Planned / Integrated |
| Disposable & Temp-Email Detection | `AuthRegisterScreen` | `POST /api/v1/auth/register` (Server Guard) | Planned / Integrated |
| Hardware Device Fingerprinting | `AuthRegisterScreen` | Device ID / Expo Application ID | Planned / Integrated |
| 6-Digit OTP Verification (SMS / Email) | `AuthVerifyOtpScreen` | `POST /api/v1/auth/verify-otp` | Planned / Integrated |
| Resend OTP with Cooldown Timer | `AuthVerifyOtpScreen` | `POST /api/v1/auth/resend-otp` | Planned / Integrated |
| Profile Created For (Self, Son, Daughter, etc.) | `ProfileCreatorSelectScreen` | `POST /api/v1/auth/set-profile-creator` | Planned / Integrated |
| Multi-Step Profile Setup Wizard | `ProfileWizardScreen` | `POST /api/v1/profile/update` | Planned / Integrated |
| Forgot Password / Reset Link Workflow | `AuthForgotPasswordScreen` | `POST /api/v1/auth/forgot-password` | Planned / Integrated |
| Account Status Checker (Active, Pending, Suspended) | `AccountStatusScreen` | `GET /api/v1/auth/session` | Planned / Integrated |
| Biometric Native Quick Unlock (Fingerprint / Face ID) | `BiometricLockScreen` / App Gate | Native `expo-local-authentication` | Planned / Integrated |

---

## 2. Dashboard & Home Overview

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Profile Completion Progress & Quick Action | `HomeScreen` (Overview) | `GET /api/v1/profile/dossier/:id` | Planned / Integrated |
| Trust Badges (Basic Verified, Selfie & ID Verified) | `HomeScreen` / `TrustBadgeComponent` | `GET /api/v1/security/trust-badges/:userId` | Planned / Integrated |
| Performance Analytics (Views, Likes, Matches) | `HomeScreen` (Analytics) | `GET /api/v1/activity/analytics` | Planned / Integrated |
| Daily Recommended Matches Carousel | `HomeScreen` (Recommendations) | `GET /api/v1/matches/recommendations` | Planned / Integrated |
| Quick Upgrade VIP Plan Promotional Banner | `HomeScreen` / `MembershipScreen` | `GET /api/v1/membership/plans` | Planned / Integrated |
| Security Shield & Quarantine Alert Status | `HomeScreen` / App Toast | `GET /api/v1/security/user-alerts` | Planned / Integrated |

---

## 3. Discover & Smart Matching

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Browse Profiles Feed with Filter Tags | `DiscoverScreen` | `GET /api/v1/search/browse` | Planned / Integrated |
| AI / Smart Compatibility Scoring (6 Pillars) | `DiscoverScreen` / `SmartMatchesScreen` | `POST /api/v1/matches/smart-compatibility` | Planned / Integrated |
| Send Express Interest (Daily Limit Enforced) | `DiscoverScreen` / `ProfileDetailScreen` | `POST /api/v1/communication/interests/send` | Planned / Integrated |
| Shortlist Profile / Add to Favorites | `DiscoverScreen` / `ProfileDetailScreen` | `POST /api/v1/activity/shortlist/add` | Planned / Integrated |
| Full Dossier Detailed Profile View | `ProfileDetailScreen` | `GET /api/v1/profile/dossier/:id` | Planned / Integrated |
| Request Contact Details (VIP / Accepted) | `ProfileDetailScreen` | `POST /api/v1/communication/contact/request` | Planned / Integrated |
| Request Photo Access (Private Photos) | `ProfileDetailScreen` | `POST /api/v1/communication/photo/request` | Planned / Integrated |
| Report Fake / Suspicious Profile (3-Strike Auto Suspend) | `ReportProfileModal` | `POST /api/v1/security/report-profile` | Planned / Integrated |
| Block / Hide Specific Profile | `ProfileDetailScreen` | `POST /api/v1/security/privacy/block` | Planned / Integrated |

---

## 4. Advanced Search & Filtering

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Basic Filter (Age range, Height, Marital Status) | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Community Filter (Religion, Caste, Mother Tongue) | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Location Filter (Country, State, City) | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Education & Career (Degree, Employment, Income) | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Lifestyle Filter (Diet, Smoking, Drinking) | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Horoscope / Astrological Filter (Manglik, Nakshatra) | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Verified Only & Photos Only Toggles | `AdvancedSearchScreen` | `POST /api/v1/search/query` | Planned / Integrated |
| Save Search Criteria for Instant Recall | `SavedSearchesScreen` | `POST /api/v1/search/save-search` | Planned / Integrated |

---

## 5. Interests & Connection Management

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Received Interests (Accept / Decline) | `InterestsScreen` (Tab: Received) | `GET /api/v1/communication/interests/received` | Planned / Integrated |
| Sent Interests (Cancel / Track Status) | `InterestsScreen` (Tab: Sent) | `GET /api/v1/communication/interests/sent` | Planned / Integrated |
| Mutual Connections (Chat Enabled) | `InterestsScreen` (Tab: Accepted) | `GET /api/v1/communication/interests/accepted` | Planned / Integrated |
| Shortlisted Profiles List | `InterestsScreen` (Tab: Shortlist) | `GET /api/v1/activity/shortlist/list` | Planned / Integrated |
| Recent Profile Visitors | `InterestsScreen` (Tab: Visitors) | `GET /api/v1/activity/visitors` | Planned / Integrated |
| Daily Interest Quota Tracking (Anti-Bot) | `InterestsScreen` (Quota Badge) | `GET /api/v1/communication/interests/quota` | Planned / Integrated |

---

## 6. Secure Real-Time Messaging & Chat

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Active Conversations List | `ChatListScreen` | `GET /api/v1/communication/chat/threads` | Planned / Integrated |
| Real-time Conversation View | `ChatRoomScreen` | `GET /api/v1/communication/chat/messages/:threadId` | Planned / Integrated |
| Send Text Message | `ChatRoomScreen` | `POST /api/v1/communication/chat/send` | Planned / Integrated |
| Financial Scam & High-Risk Keyword Interceptor | `ChatRoomScreen` (Security Shield) | Content Moderation & Safe Browsing Service | Planned / Integrated |
| Recipient Safety Warning Banner | `ChatRoomScreen` | Instant Local & Server Safety Flag | Planned / Integrated |
| 5 Compatibility Icebreaker Questions | `ChatRoomScreen` | Local Client Dataset & Suggestions | Planned / Integrated |
| Quick Report / Block from Chat Header | `ChatRoomScreen` | `POST /api/v1/security/privacy/block` | Planned / Integrated |

---

## 7. My Profile & Partner Preferences Management

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| View Complete Profile Dossier | `MyProfileScreen` | `GET /api/v1/profile/dossier/:id` | Planned / Integrated |
| Edit Basic & Personal Information | `EditProfileScreen` (Basic) | `PUT /api/v1/profile/update` | Planned / Integrated |
| Edit Religion & Caste Details | `EditProfileScreen` (Religion) | `PUT /api/v1/profile/update` | Planned / Integrated |
| Edit Education & Career Information | `EditProfileScreen` (Career) | `PUT /api/v1/profile/update` | Planned / Integrated |
| Edit Family Background & Lifestyle | `EditProfileScreen` (Family) | `PUT /api/v1/profile/update` | Planned / Integrated |
| Upload Profile Photo with EXIF GPS Stripping | `PhotoManagerScreen` | `POST /api/v1/security/photo/upload-sanitized` | Planned / Integrated |
| Biometric Face Deduplication Guard | `PhotoManagerScreen` | Server-side Sharp Face Descriptor Check | Planned / Integrated |
| NSFW / Inappropriate Image Content Guard | `PhotoManagerScreen` | Server-side Chrominance & Skin Density Check | Planned / Integrated |
| Manage Partner Preferences (Age, Caste, State) | `PartnerPreferencesScreen` | `PUT /api/v1/matches/preferences` | Planned / Integrated |

---

## 8. Vedic Kundli Milan & Astrological Matching

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| 36-Guna Ashtakoot Matching Calculator | `KundliMilanScreen` | `POST /api/v1/kundli/calculate-guna` | Planned / Integrated |
| 8 Koot Breakdown (Varna, Vashya, Tara, Yoni, etc.) | `KundliMilanScreen` | Ashtakoot Calculation Engine | Planned / Integrated |
| Manglik Dosha Compatibility Check | `KundliMilanScreen` | Manglik Compatibility Rule Engine | Planned / Integrated |
| Matching with Any Registered Profile | `KundliMilanScreen` | `POST /api/v1/kundli/match-profile` | Planned / Integrated |
| Custom Birth Details Matching (Boy & Girl) | `KundliMilanScreen` (Custom Form) | `POST /api/v1/kundli/custom-match` | Planned / Integrated |

---

## 9. KYC Verification, Badges & Privacy Controls

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Upload Govt ID (Aadhaar / Passport / Voter ID) | `KycVerificationScreen` | `POST /api/v1/security/kyc/upload` | Planned / Integrated |
| Live Selfie Verification (Face Check) | `SelfieVerificationScreen` | `POST /api/v1/security/selfie/verify` | Planned / Integrated |
| Workplace / Employment Proof Verification | `WorkplaceVerificationScreen` | `POST /api/v1/security/employment/upload` | Planned / Integrated |
| Selective Field Lock (Salary, Family, Contact) | `PrivacySettingsScreen` | `PUT /api/v1/security/privacy/selective-lock` | Planned / Integrated |
| Custom Visibility Rules (Verified Only, Same State) | `PrivacySettingsScreen` | `PUT /api/v1/security/privacy/visibility-rules` | Planned / Integrated |
| Hide Profile from Specific Users / Relatives | `PrivacySettingsScreen` | `POST /api/v1/security/privacy/hide-from` | Planned / Integrated |
| Manage Blocked Users List | `PrivacySettingsScreen` | `GET /api/v1/security/privacy/blocked-users` | Planned / Integrated |
| Incognito Mode / Hide Profile Completely | `PrivacySettingsScreen` | `PUT /api/v1/security/privacy/incognito` | Planned / Integrated |

---

## 10. Royal Membership Plans & Payment

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| View Membership Plans (Gold, Platinum, Royal VIP) | `MembershipPlansScreen` | `GET /api/v1/membership/plans` | Planned / Integrated |
| Compare Plan Benefits & Feature Gating | `MembershipPlansScreen` | `GET /api/v1/membership/features` | Planned / Integrated |
| Select Plan & Generate Offline UPI / QR Invoice | `MembershipPaymentScreen` | `POST /api/v1/membership/checkout/manual` | Planned / Integrated |
| Upload Payment Proof Slip / Screenshot | `MembershipPaymentScreen` | `POST /api/v1/membership/payment/upload-slip` | Planned / Integrated |
| Active Subscription Status & Expiry Date | `MembershipPlansScreen` | `GET /api/v1/membership/current` | Planned / Integrated |

---

## 11. Customer Support & Referral Program

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Frequently Asked Questions (FAQ Accordion) | `SupportFaqScreen` | `GET /api/v1/support/faqs` | Planned / Integrated |
| Create Support Ticket / Complaint | `SupportTicketCreateScreen` | `POST /api/v1/support/tickets/create` | Planned / Integrated |
| Track Active Support Tickets & Admin Replies | `SupportTicketsListScreen` | `GET /api/v1/support/tickets/my` | Planned / Integrated |
| Direct WhatsApp / Phone Helpline Trigger | `SupportFaqScreen` | Native Linking (`whatsapp://`, `tel:`) | Planned / Integrated |
| Referral Code & Earn Rewards Sharing | `ReferralRewardsScreen` | `GET /api/v1/activity/referral-stats` | Planned / Integrated |

---

## 12. Account Settings & Device Security

| Existing Website Feature | Mobile Screen | API Used | Status |
|---|---|---|---|
| Change Password | `SettingsScreen` | `POST /api/v1/settings/change-password` | Planned / Integrated |
| Push Notification Preferences | `SettingsScreen` | `PUT /api/v1/settings/notification-prefs` | Planned / Integrated |
| Biometric App Lock Toggle | `SettingsScreen` | Native SecureStore / Biometric Config | Planned / Integrated |
| Active Login Sessions & Remote Logout | `SettingsScreen` | `GET /api/v1/settings/sessions` | Planned / Integrated |
| Deactivate / Delete Account | `SettingsScreen` | `POST /api/v1/settings/account/delete` | Planned / Integrated |
| Secure Local Logout | `SettingsScreen` | Token Revocation & SecureStore Clear | Planned / Integrated |
