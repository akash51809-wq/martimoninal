import * as ImagePicker from "expo-image-picker";

export const MediaPickerService = {
  async pickImageFromGallery(): Promise<{
    cancelled: boolean;
    base64?: string;
    uri?: string;
    error?: string;
  }> {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        return {
          cancelled: true,
          error: "Photo library access permission is required to choose a profile picture.",
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { cancelled: true };
      }

      const asset = result.assets[0];
      return {
        cancelled: false,
        uri: asset.uri,
        base64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : undefined,
      };
    } catch (error: any) {
      return {
        cancelled: true,
        error: error.message || "Failed to select photo from gallery",
      };
    }
  },

  async captureImageWithCamera(): Promise<{
    cancelled: boolean;
    base64?: string;
    uri?: string;
    error?: string;
  }> {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        return {
          cancelled: true,
          error: "Camera access permission is required to take a live photo.",
        };
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return { cancelled: true };
      }

      const asset = result.assets[0];
      return {
        cancelled: false,
        uri: asset.uri,
        base64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : undefined,
      };
    } catch (error: any) {
      return {
        cancelled: true,
        error: error.message || "Failed to capture photo with camera",
      };
    }
  },
};
