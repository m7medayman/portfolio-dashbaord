// src/services/cloudinaryService.ts

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!;

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

export const CloudinaryService = {
  /**
   * Uploads an image to Cloudinary
   * @param file Image file to upload
   * @returns { secureUrl, publicId }
   */
  async uploadImage(file: File): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to upload image");
    }

    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
    };
  },

  /**
   * Builds a URL for an existing public ID
   */
  getImageUrl(publicId: string): string {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;
  },
};
