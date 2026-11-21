import sharp from "sharp";
import crypto from "crypto";

export interface ExtractedGeoLocation {
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  deviceMake?: string;
  deviceModel?: string;
  capturedAt?: string;
  sanitizedAt: string;
  fileSizeBytes: number;
  originalFormat?: string;
}

/**
 * Helper to parse rational from TIFF buffer
 */
function readRational(buffer: Buffer, offset: number, isLittleEndian: boolean): number {
  if (offset + 8 > buffer.length) return 0;
  const num = isLittleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
  const den = isLittleEndian ? buffer.readUInt32LE(offset + 4) : buffer.readUInt32BE(offset + 4);
  return den === 0 ? 0 : num / den;
}

/**
 * Lightweight pure-TS EXIF parser for GPS & Device metadata
 */
function parseExifBuffer(exifBuffer: Buffer): Partial<ExtractedGeoLocation> {
  const result: Partial<ExtractedGeoLocation> = { hasGps: false };

  try {
    if (exifBuffer.length < 14) return result;

    // Check for "Exif\0\0" header
    let tiffStart = 0;
    if (exifBuffer.toString("ascii", 0, 4) === "Exif") {
      tiffStart = 6;
    }

    const byteOrder = exifBuffer.toString("ascii", tiffStart, tiffStart + 2);
    const isLittleEndian = byteOrder === "II";
    if (byteOrder !== "II" && byteOrder !== "MM") return result;

    const readU16 = (off: number) =>
      isLittleEndian ? exifBuffer.readUInt16LE(tiffStart + off) : exifBuffer.readUInt16BE(tiffStart + off);
    const readU32 = (off: number) =>
      isLittleEndian ? exifBuffer.readUInt32LE(tiffStart + off) : exifBuffer.readUInt32BE(tiffStart + off);

    const firstIfdOffset = readU32(4);
    if (firstIfdOffset >= exifBuffer.length - tiffStart) return result;

    const numEntries = readU16(firstIfdOffset);
    let gpsIfdOffset = 0;

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = firstIfdOffset + 2 + i * 12;
      if (entryOffset + 12 > exifBuffer.length - tiffStart) break;

      const tag = readU16(entryOffset);
      const valOffset = readU32(entryOffset + 8);

      // Make tag: 0x010F
      if (tag === 0x010f && valOffset < exifBuffer.length - tiffStart) {
        const str = exifBuffer.toString("utf8", tiffStart + valOffset, tiffStart + valOffset + 32).split("\0")[0];
        result.deviceMake = str.trim();
      }

      // Model tag: 0x0110
      if (tag === 0x0110 && valOffset < exifBuffer.length - tiffStart) {
        const str = exifBuffer.toString("utf8", tiffStart + valOffset, tiffStart + valOffset + 32).split("\0")[0];
        result.deviceModel = str.trim();
      }

      // DateTime tag: 0x0132
      if (tag === 0x0132 && valOffset < exifBuffer.length - tiffStart) {
        const str = exifBuffer.toString("utf8", tiffStart + valOffset, tiffStart + valOffset + 20).split("\0")[0];
        result.capturedAt = str.trim();
      }

      // GPSInfo tag: 0x8825
      if (tag === 0x8825) {
        gpsIfdOffset = valOffset;
      }
    }

    // Parse GPS IFD if present
    if (gpsIfdOffset > 0 && gpsIfdOffset < exifBuffer.length - tiffStart) {
      const numGpsEntries = readU16(gpsIfdOffset);
      let latRef = "N";
      let lonRef = "E";
      let latDeg = 0, latMin = 0, latSec = 0;
      let lonDeg = 0, lonMin = 0, lonSec = 0;
      let hasLat = false;
      let hasLon = false;

      for (let j = 0; j < numGpsEntries; j++) {
        const gEntry = gpsIfdOffset + 2 + j * 12;
        if (gEntry + 12 > exifBuffer.length - tiffStart) break;

        const gTag = readU16(gEntry);
        const gValOffset = readU32(gEntry + 8);

        // GPSLatitudeRef (0x0001)
        if (gTag === 0x0001) {
          latRef = exifBuffer.toString("ascii", tiffStart + gEntry + 8, tiffStart + gEntry + 9);
        }
        // GPSLatitude (0x0002)
        if (gTag === 0x0002 && gValOffset + 24 <= exifBuffer.length - tiffStart) {
          latDeg = readRational(exifBuffer, tiffStart + gValOffset, isLittleEndian);
          latMin = readRational(exifBuffer, tiffStart + gValOffset + 8, isLittleEndian);
          latSec = readRational(exifBuffer, tiffStart + gValOffset + 16, isLittleEndian);
          hasLat = true;
        }
        // GPSLongitudeRef (0x0003)
        if (gTag === 0x0003) {
          lonRef = exifBuffer.toString("ascii", tiffStart + gEntry + 8, tiffStart + gEntry + 9);
        }
        // GPSLongitude (0x0004)
        if (gTag === 0x0004 && gValOffset + 24 <= exifBuffer.length - tiffStart) {
          lonDeg = readRational(exifBuffer, tiffStart + gValOffset, isLittleEndian);
          lonMin = readRational(exifBuffer, tiffStart + gValOffset + 8, isLittleEndian);
          lonSec = readRational(exifBuffer, tiffStart + gValOffset + 16, isLittleEndian);
          hasLon = true;
        }
      }

      if (hasLat && hasLon) {
        let lat = latDeg + latMin / 60 + latSec / 3600;
        if (latRef === "S") lat = -lat;
        let lon = lonDeg + lonMin / 60 + lonSec / 3600;
        if (lonRef === "W") lon = -lon;

        result.hasGps = true;
        result.latitude = parseFloat(lat.toFixed(6));
        result.longitude = parseFloat(lon.toFixed(6));
      }
    }
  } catch (err) {
    console.warn("[EXIF Parser Warn]: Non-fatal error while reading EXIF buffer:", err);
  }

  return result;
}

export const photoSanitizerService = {
  /**
   * Sanitizes an uploaded photo buffer or base64 data URI:
   * 1. Extracts EXIF GPS coordinates and device model.
   * 2. Completely deletes all EXIF/GPS metadata from the output image.
   * 3. Returns the clean image buffer, sanitized data URI, and extracted geo-metadata for Admin audit.
   */
  async sanitizeAndStripExif(
    input: Buffer | string
  ): Promise<{
    sanitizedBuffer: Buffer;
    sanitizedDataUri: string;
    geoAudit: ExtractedGeoLocation;
  }> {
    let rawBuffer: Buffer;

    if (typeof input === "string") {
      // Handle data URI
      const base64Index = input.indexOf(";base64,");
      if (base64Index !== -1) {
        rawBuffer = Buffer.from(input.slice(base64Index + 8), "base64");
      } else {
        rawBuffer = Buffer.from(input, "base64");
      }
    } else {
      rawBuffer = input;
    }

    const imageInstance = sharp(rawBuffer);
    const metadata = await imageInstance.metadata();

    let extracted: Partial<ExtractedGeoLocation> = { hasGps: false };
    if (metadata.exif && metadata.exif.length > 0) {
      extracted = parseExifBuffer(metadata.exif);
    }

    // Default device info if not found in EXIF
    const geoAudit: ExtractedGeoLocation = {
      hasGps: Boolean(extracted.hasGps),
      latitude: extracted.latitude,
      longitude: extracted.longitude,
      altitude: extracted.altitude,
      deviceMake: extracted.deviceMake || "Standard Mobile / Browser",
      deviceModel: extracted.deviceModel || "Smartphone Camera",
      capturedAt: extracted.capturedAt || new Date().toISOString(),
      sanitizedAt: new Date().toISOString(),
      fileSizeBytes: rawBuffer.length,
      originalFormat: metadata.format || "jpeg",
    };

    // Re-encode through sharp WITHOUT .withMetadata() to guarantee 100% EXIF GPS deletion
    const sanitizedBuffer = await sharp(rawBuffer)
      .rotate() // Auto-orient based on EXIF before removing EXIF
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    const sanitizedDataUri = `data:image/jpeg;base64,${sanitizedBuffer.toString("base64")}`;

    return {
      sanitizedBuffer,
      sanitizedDataUri,
      geoAudit,
    };
  },
};
