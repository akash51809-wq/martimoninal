# Automated Android APK Build Script for Vivah Kar Lo
$ErrorActionPreference = "Stop"

$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$BuildTools = "$SdkPath\build-tools\34.0.0"
$PlatformJar = "$SdkPath\platforms\android-34\android.jar"
$Keytool = "C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot\bin\keytool.exe"

Write-Host "1. Compiling Android resources with aapt..."
& "$BuildTools\aapt.exe" package -f -m -J "android_app/src" -M "android_app/AndroidManifest.xml" -S "android_app/res" -I "$PlatformJar"

Write-Host "2. Compiling Java classes with javac..."
javac --release 8 -d "android_app/bin" -cp "$PlatformJar" "android_app/src/in/vivahkarlo/app/MainActivity.java" "android_app/src/in/vivahkarlo/app/R.java"

Write-Host "3. Generating Dalvik executable with d8..."
$classes = (Get-ChildItem "android_app/bin/in/vivahkarlo/app/*.class").FullName
& "$BuildTools\d8.bat" --output "android_app/bin" --lib "$PlatformJar" $classes

Write-Host "4. Packaging APK with aapt..."
& "$BuildTools\aapt.exe" package -f -M "android_app/AndroidManifest.xml" -S "android_app/res" -I "$PlatformJar" -F "android_app/bin/app.unaligned.apk"

Write-Host "5. Adding classes.dex to APK..."
Push-Location "android_app/bin"
try {
    & "$BuildTools\aapt.exe" add "app.unaligned.apk" "classes.dex"
} finally {
    Pop-Location
}

Write-Host "6. Aligning APK with zipalign..."
& "$BuildTools\zipalign.exe" -f -p 4 "android_app/bin/app.unaligned.apk" "android_app/bin/app.aligned.apk"

Write-Host "7. Signing APK with apksigner (v1, v2, v3)..."
New-Item -ItemType Directory -Force -Path "public/downloads" | Out-Null
New-Item -ItemType Directory -Force -Path "client/public/downloads" | Out-Null
& "$BuildTools\apksigner.bat" sign --ks "android_app/release.keystore" --ks-pass pass:vivahkarlo123 --out "public/downloads/vivahkarlo-release.apk" "android_app/bin/app.aligned.apk"
Copy-Item "public/downloads/vivahkarlo-release.apk" "client/public/downloads/vivahkarlo-release.apk" -Force

Write-Host "8. Verifying APK signature..."
& "$BuildTools\apksigner.bat" verify --verbose "public/downloads/vivahkarlo-release.apk"

Write-Host "Success! Generated production APK at public/downloads/vivahkarlo-release.apk"
