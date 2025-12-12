import api from "./api";

export interface UploadResponse {
  filename: string | null;
}

export interface SignedUrlResponse {
  signedUrl: string;
}

export interface PublicUrlResponse {
  publicUrl: string;
}

export const fileService = {
    async upload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  async getSignedUrl(filename: string): Promise<SignedUrlResponse> {
    const response = await api.get<SignedUrlResponse>(`/files/signed-url/${filename}`);
    return response.data;
  },

  async getPublicUrl(filename: string): Promise<PublicUrlResponse> {
    const response = await api.get<PublicUrlResponse>(`/files/public-url/${filename}`);
    return response.data;
  },
  
  async uploadImage(file: File, type: 'logo' | 'banner'): Promise<string> {
    try {
      // Upload file
      const uploadResult = await this.upload(file);
      
      if (!uploadResult.filename) {
        throw new Error('Upload failed: no filename returned');
      }
      
      // Get signed URL
      const signedUrlResult = await this.getSignedUrl(uploadResult.filename);
      
      return signedUrlResult.signedUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  },
};