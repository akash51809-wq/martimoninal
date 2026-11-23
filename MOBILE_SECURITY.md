# Vivah Kar Lo — Mobile Application Security Architecture

## 1. Executive Summary & Security Posture
The Vivah Kar Lo mobile application implements layered defense-in-depth principles inspired by the **OWASP Mobile Application Security Verification Standard (MASVS)** and industry best practices for personal relationship and matrimonial platforms.

Given that matrimonial platforms process sensitive personal identifiable information (PII), horoscopes, family backgrounds, financial profiles, and personal photographs, mobile security is treated as a top-priority engineering constraint.

---

## 2. Authentication & Session Security (MASVS-AUTH)

### 2.1 Hardware-Backed Secure Token Storage
- **Implementation**: Sensitive authentication tokens (JWT access tokens and session IDs) are stored exclusively using `expo-secure-store`.
- **Under the Hood**:
  - **Android**: Secured via the Android Keystore Provider using AES-GCM encryption with keys hardware-backed in the Trusted Execution Environment (TEE) or StrongBox Keymaster where available.
  - **iOS**: Secured via Apple iOS Keychain Services with `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`, preventing tokens from leaking into iCloud backups or being exported to unauthorized devices.
- **Strict Avoidance**: Plain `AsyncStorage` or unencrypted SQLite is **never** used for credentials, tokens, or private secrets.

### 2.2 Token Expiration & Secure Revocation
- Tokens feature automatic expiration and cryptographically signed session validation against the server.
- Explicit Logout triggers:
  1. Revocation of active session on the backend (`POST /api/v1/auth/logout`).
  2. Complete purging of all keys from native `SecureStore`.
  3. Eviction of query caches from TanStack Query memory to prevent screen lingering.

---

## 3. Biometric App Lock & Privacy Shield (MASVS-PRIV)

### 3.1 Hardware Biometrics via Native API
- Biometric authentication leverages `expo-local-authentication` (`LocalAuthentication.authenticateAsync`).
- Supports **Face ID**, **Touch ID**, and **Android BiometricPrompt** (Class 3 strong biometrics).
- **Zero Raw Data Collection**: The app never captures, processes, or transmits raw biometric vectors or fingerprint images. Authentication occurs entirely within the device operating system enclave.
- **Passcode Fallback**: In the event of biometric failure or temporary hardware unavailability, the native device passcode/PIN is used as a secure fallback.

### 3.2 App-Switcher Snapshot Masking
- When the user switches between applications on Android or iOS, sensitive profile data and photos are masked from the system task switcher to prevent visual shoulder-surfing.

---

## 4. Media, Camera & Photograph Protection (MASVS-MEDIA)

### 4.1 EXIF Metadata & Geolocation Stripping
- Smartphone cameras embed exact GPS coordinates, camera model, and capture timestamp in image EXIF tags.
- The mobile application sanitizes all images before transmission:
  - Local stripping/compression via `expo-image-picker` with `quality: 0.8`.
  - Backend secondary verification using `Sharp` to completely remove `exif`, `icc`, and `iptc` segments before storage.

### 4.2 Biometric Face Deduplication Guard
- Photos uploaded through the mobile application undergo automated 64-dimensional face descriptor extraction and cosine similarity verification.
- Re-registering with identical facial portraits under multiple names is automatically blocked, preventing catfishing.

### 4.3 NSFW & Inappropriate Image Content Guard
- Multi-tier chrominance and skin density analysis ($> 45\%$) detects and blocks inappropriate, explicit, or cartoon images before they enter public member galleries.

---

## 5. Location Privacy & Principle of Least Privilege

- Location retrieval operates on **Coarse Accuracy** only (`LocationAccuracy.Balanced` / `LocationAccuracy.Low`).
- Never tracks users in the background.
- Exact GPS coordinates are never stored or exposed publicly. Location is resolved to City/State for matrimonial distance matching only.
- The app remains 100% functional even if the user denies location permission.

---

## 6. Financial Fraud & Real-Time In-Chat Scam Interceptor

- All chat messages sent or received in the mobile app are parsed in real time by the **Content Moderation & Fraud Interceptor Service**.
- High-risk keywords ("पैसे भेजो", "UPI", "Google Pay", "PhonePe", "OTP", "Emergency", "WhatsApp पर आओ") trigger:
  1. An instant prominent warning banner for the recipient in the mobile chat view.
  2. An automatic background incident report dispatched to the Vivah Kar Lo Admin Scam Alerts Desk.

---

## 7. Over-The-Air (OTA) Updates & Code Integrity

- Code updates deployed via **EAS Update** (`expo-updates`) are cryptographically verified against the Vivah Kar Lo release manifest before application.
- Updates apply smoothly on app restart without disrupting in-progress chats, forms, or payment flows.
