# Vivah Kar Lo — Mobile Application Release & Deployment Guide

## 1. Overview
This guide provides complete, step-by-step instructions for building, signing, distributing, and updating the Vivah Kar Lo mobile application for Android and iOS using **Expo EAS (Expo Application Services)** and local tooling.

---

## 2. Prerequisites & Setup

Ensure the following tools are available:
1. **Node.js**: v18+ or v20+ / v24+
2. **EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
3. **Expo Account**:
   ```bash
   eas login
   ```

---

## 3. Building Android Production APK (Direct Download)

To generate a standalone `.apk` file that users can download directly from the Vivah Kar Lo website without the Google Play Store:

### Step 1: Verify Configuration
Check `mobile/eas.json` for the `production` profile:
```json
{
  "build": {
    "production": {
      "channel": "production",
      "autoIncrement": true,
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Step 2: Run EAS APK Build
Inside the `mobile/` directory:
```bash
cd mobile
eas build --platform android --profile production
```
EAS will compile the native Android binary, optimize assets, generate the production keystore, and provide a direct download URL for the signed APK.

### Step 3: Placing the APK on the Website
Copy the downloaded release APK to the public web server directory:
```bash
# Destination in root project:
public/downloads/vivahkarlo-release.apk
```
The website homepage download button points directly to `/downloads/vivahkarlo-release.apk`.

---

## 4. Building for Google Play Store (Android App Bundle - AAB)

Google Play requires the `.aab` format for publishing:

### Step 1: Configure App Bundle Build in `eas.json`
```json
{
  "build": {
    "play-store": {
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Step 2: Trigger Play Store Build
```bash
cd mobile
eas build --platform android --profile play-store
```

### Step 3: Submit to Google Play
```bash
eas submit --platform android
```

---

## 5. Building for Apple iOS (App Store & TestFlight)

### Step 1: Configure iOS Bundle Identifier
In `mobile/app.json`:
- Bundle Identifier: `in.vivahkarlo.app`

### Step 2: Run EAS iOS Production Build
```bash
cd mobile
eas build --platform ios --profile production
```
EAS will automatically manage certificates, provisioning profiles, and code signing with your Apple Developer Account.

### Step 3: Submit to TestFlight / App Store
```bash
eas submit --platform ios
```

---

## 6. Publishing Over-The-Air (OTA) Updates

One of Vivah Kar Lo's most powerful capabilities is instant OTA updates via `expo-updates`. 

When making UI enhancements, color tweaks, bug fixes, or new screens that **do not require changes to native Android/iOS binary code or new native permissions**, you can publish an update in seconds:

### Step 1: Make Code Changes
Make the required edits in `mobile/src/`.

### Step 2: Publish Update to Production Channel
```bash
cd mobile
eas update --channel production --message "Fix profile card padding and update chat safety alert"
```

### Step 3: User Experience
When users open the app:
1. `expo-updates` checks for new updates on startup.
2. The update is downloaded silently in the background.
3. On the next app launch (or upon user confirmation), the update is seamlessly applied without needing a download from the Play Store!

---

## 7. Versioning & Native Binary Updates

### When is a New Native Store Build Required?
A new APK/AAB or App Store build is **strictly required** only when:
- Adding a new native hardware capability (e.g., Bluetooth, NFC).
- Modifying native permissions in `app.json` (e.g., requesting Bluetooth).
- Upgrading the major Expo SDK version (e.g., SDK 52 -> SDK 53).

For standard screen additions, layout refinements, and API updates, OTA updates are 100% sufficient.

---

## 8. Updating the Homepage Download Link

The website homepage download section automatically serves the latest production APK placed in `public/downloads/vivahkarlo-release.apk`. 

To update the version displayed on the website:
1. Replace `public/downloads/vivahkarlo-release.apk`.
2. Update the version label in `client/src/components/home/MembershipAndAppSection.tsx`.
