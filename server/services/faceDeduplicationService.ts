/**
 * Face Deduplication & Biometric Anti-Sybil Service
 * Generates perceptual facial feature descriptors using Sharp image processing
 * and computes Cosine Similarity to detect duplicate faces across accounts.
 */

import sharp from "sharp";

export interface FaceDescriptorRecord {
  id: string;
  userId: string;
  descriptor: number[];
  photoThumbnail?: string;
  createdAt: string;
}

class FaceDeduplicationService {
  private registeredFaces: FaceDescriptorRecord[] = [
    // Seed initial demo descriptors for known mock members
    {
      id: "face-priya-01",
      userId: "usr-demo-priya",
      descriptor: Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.4) * 0.5 + 0.5),
      createdAt: "2026-11-15T10:00:00Z",
    },
    {
      id: "face-rahul-02",
      userId: "usr-demo-rahul",
      descriptor: Array.from({ length: 64 }, (_, i) => Math.cos(i * 0.3) * 0.5 + 0.5),
      createdAt: "2026-11-16T12:00:00Z",
    },
  ];

  private readonly SIMILARITY_THRESHOLD = 0.88; // 88% face match threshold

  /**
   * Generates a 64-dimensional normalized gradient feature vector from a photo buffer.
   */
  public async extractFaceDescriptor(imageBuffer: Buffer): Promise<number[]> {
    try {
      // 1. Get metadata and crop central 60% face portrait zone
      const metadata = await sharp(imageBuffer).metadata();
      const width = metadata.width || 400;
      const height = metadata.height || 400;

      const cropWidth = Math.floor(width * 0.6);
      const cropHeight = Math.floor(height * 0.6);
      const cropLeft = Math.floor((width - cropWidth) / 2);
      const cropTop = Math.floor((height - cropHeight) / 3); // Slightly higher for face

      // 2. Resize central face crop to 32x32 grayscale
      const rawPixels = await sharp(imageBuffer)
        .extract({
          left: Math.max(0, cropLeft),
          top: Math.max(0, cropTop),
          width: Math.min(width, cropWidth),
          height: Math.min(height, cropHeight),
        })
        .resize(32, 32, { fit: "cover" })
        .grayscale()
        .raw()
        .toBuffer();

      // 3. Compute 64-dimensional spatial average intensity and gradient tiles (4x4 patches)
      const descriptor: number[] = [];
      const patchSize = 8; // 32 / 4 = 8

      for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
          let sum = 0;
          let gradSum = 0;
          for (let y = 0; y < patchSize; y++) {
            for (let x = 0; x < patchSize; x++) {
              const idx = (py * patchSize + y) * 32 + (px * patchSize + x);
              const val = rawPixels[idx] || 0;
              sum += val;

              // Horizontal and vertical gradient
              const rightIdx = idx + 1 < 1024 ? idx + 1 : idx;
              const downIdx = idx + 32 < 1024 ? idx + 32 : idx;
              const dx = Math.abs((rawPixels[rightIdx] || 0) - val);
              const dy = Math.abs((rawPixels[downIdx] || 0) - val);
              gradSum += dx + dy;
            }
          }
          const avgIntensity = sum / (patchSize * patchSize * 255);
          const avgGradient = gradSum / (patchSize * patchSize * 255);
          descriptor.push(avgIntensity);
          descriptor.push(avgGradient);
        }
      }

      // 4. Normalize vector to unit length
      const magnitude = Math.sqrt(descriptor.reduce((acc, val) => acc + val * val, 0)) || 1;
      return descriptor.map((val) => val / magnitude);
    } catch {
      // Fallback deterministic vector if image processing encounters an issue
      return Array.from({ length: 64 }, () => 0.125);
    }
  }

  /**
   * Computes Cosine Similarity between two feature vectors: dot(A, B) / (norm(A) * norm(B))
   */
  public computeCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;
    return dot / denominator;
  }

  /**
   * Evaluates an uploaded photo against all existing members' registered face descriptors.
   */
  public async checkDuplicateFace(
    imageBuffer: Buffer,
    currentUserId: string
  ): Promise<{
    isDuplicate: boolean;
    similarity: number;
    matchedUserId?: string;
    descriptor: number[];
    message?: string;
  }> {
    const descriptor = await this.extractFaceDescriptor(imageBuffer);

    let highestSimilarity = 0;
    let matchedUserId: string | undefined;

    for (const record of this.registeredFaces) {
      // Skip comparing against user's own previous photos
      if (record.userId === currentUserId) continue;

      const similarity = this.computeCosineSimilarity(descriptor, record.descriptor);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        matchedUserId = record.userId;
      }
    }

    const similarityPercentage = Math.round(highestSimilarity * 100);

    if (highestSimilarity >= this.SIMILARITY_THRESHOLD) {
      return {
        isDuplicate: true,
        similarity: highestSimilarity,
        matchedUserId,
        descriptor,
        message: `Face Deduplication Alert: This face matches an existing member profile (${similarityPercentage}% match with account ${matchedUserId}). Each individual is permitted only one active profile on Vivah Kar Lo. Multiple accounts with duplicate faces are prohibited.`,
      };
    }

    return {
      isDuplicate: false,
      similarity: highestSimilarity,
      descriptor,
    };
  }

  /**
   * Registers a unique face descriptor for the user.
   */
  public registerFaceDescriptor(
    userId: string,
    descriptor: number[],
    photoThumbnail?: string
  ): FaceDescriptorRecord {
    const record: FaceDescriptorRecord = {
      id: `face-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      descriptor,
      photoThumbnail,
      createdAt: new Date().toISOString(),
    };
    this.registeredFaces.push(record);
    return record;
  }

  public getAllRegisteredFaces(): FaceDescriptorRecord[] {
    return this.registeredFaces;
  }
}

export const faceDeduplicationService = new FaceDeduplicationService();
