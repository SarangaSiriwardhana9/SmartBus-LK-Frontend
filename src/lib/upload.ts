/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiClient } from './api-client';
import { API_ENDPOINTS } from './constants';
// Fix imports - use regular imports instead of type imports for values
import {
  FileUploadDto,
  SingleUploadResult,
  MultipleUploadResult,
  EntityFilesResult,
  DeleteResult,
  FileType,
  DocumentType,
  FILE_CONSTRAINTS, // Regular import, not type import
} from './types';

export class UploadService {
  // Single file upload
  async uploadSingleFile(
    file: File,
    uploadOptions: Partial<FileUploadDto> = {}
  ): Promise<SingleUploadResult> {
    this.validateFile(file, uploadOptions.fileType);

    const formData = new FormData();
    formData.append('file', file);
    
    // Add upload options
    Object.entries(uploadOptions).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.upload<SingleUploadResult>(
      API_ENDPOINTS.UPLOAD.SINGLE,
      formData
    );
  }

  // Multiple files upload
  async uploadMultipleFiles(
    files: File[],
    uploadOptions: Partial<FileUploadDto> = {}
  ): Promise<MultipleUploadResult> {
    if (files.length === 0) {
      throw new Error('No files selected');
    }

    if (files.length > FILE_CONSTRAINTS.MAX_FILES_PER_UPLOAD) {
      throw new Error(`Maximum ${FILE_CONSTRAINTS.MAX_FILES_PER_UPLOAD} files allowed`);
    }

    files.forEach(file => this.validateFile(file, uploadOptions.fileType));

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    // Add upload options
    Object.entries(uploadOptions).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.upload<MultipleUploadResult>(
      API_ENDPOINTS.UPLOAD.MULTIPLE,
      formData
    );
  }

  // Bus specific uploads
  async uploadBusImages(busId: string, images: File[]): Promise<MultipleUploadResult> {
    if (images.length === 0) {
      throw new Error('No images selected');
    }

    if (images.length > FILE_CONSTRAINTS.MAX_BUS_IMAGES) {
      throw new Error(`Maximum ${FILE_CONSTRAINTS.MAX_BUS_IMAGES} images allowed`);
    }

    images.forEach(image => this.validateFile(image, FileType.IMAGE));

    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    return apiClient.upload<MultipleUploadResult>(
      API_ENDPOINTS.UPLOAD.BUS_IMAGES(busId),
      formData
    );
  }

  async uploadBusDocuments(
    busId: string,
    documents: File[],
    documentType?: DocumentType,
    description?: string
  ): Promise<MultipleUploadResult> {
    if (documents.length === 0) {
      throw new Error('No documents selected');
    }

    if (documents.length > FILE_CONSTRAINTS.MAX_BUS_DOCUMENTS) {
      throw new Error(`Maximum ${FILE_CONSTRAINTS.MAX_BUS_DOCUMENTS} documents allowed`);
    }

    documents.forEach(doc => this.validateFile(doc, FileType.DOCUMENT));

    const formData = new FormData();
    documents.forEach(document => {
      formData.append('documents', document);
    });

    if (documentType) {
      formData.append('documentType', documentType);
    }

    if (description) {
      formData.append('description', description);
    }

    return apiClient.upload<MultipleUploadResult>(
      API_ENDPOINTS.UPLOAD.BUS_DOCUMENTS(busId),
      formData
    );
  }

  // Profile picture upload
  async uploadProfilePicture(profilePicture: File): Promise<SingleUploadResult> {
    this.validateFile(profilePicture, FileType.PROFILE_PICTURE);

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    return apiClient.upload<SingleUploadResult>(
      API_ENDPOINTS.UPLOAD.PROFILE_PICTURE,
      formData
    );
  }

  // Get file URL
  getFileUrl(filename: string): string {
    return `${API_ENDPOINTS.UPLOAD.GET_FILE(filename)}`;
  }

  // Get entity files
  async getEntityFiles(
    entityType: 'bus' | 'user',
    entityId: string
  ): Promise<EntityFilesResult> {
    return apiClient.get<EntityFilesResult>(
      API_ENDPOINTS.UPLOAD.ENTITY_FILES(entityType, entityId)
    );
  }

  // Delete file
  async deleteFile(filename: string): Promise<DeleteResult> {
    return apiClient.delete<DeleteResult>(
      API_ENDPOINTS.UPLOAD.DELETE_FILE(filename)
    );
  }

  // Validation methods
  private validateFile(file: File, fileType?: FileType): void {
    // Check file size
    if (file.size > FILE_CONSTRAINTS.MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${this.formatFileSize(FILE_CONSTRAINTS.MAX_FILE_SIZE)}`);
    }

    // Check file type
    if (fileType) {
      switch (fileType) {
        case FileType.IMAGE:
        case FileType.PROFILE_PICTURE:
          if (!FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
            throw new Error('Invalid image format. Only JPEG, PNG, and WebP are allowed');
          }
          break;
        case FileType.DOCUMENT:
          if (!FILE_CONSTRAINTS.ALLOWED_DOCUMENT_TYPES.includes(file.type as any)) {
            throw new Error('Invalid document format. Only PDF, JPEG, and PNG are allowed');
          }
          break;
        default:
          throw new Error('Invalid file type');
      }
    }
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    return imageExtensions.includes(this.getFileExtension(filename));
  }

  isPdfFile(filename: string): boolean {
    return this.getFileExtension(filename) === 'pdf';
  }

  validateFileBeforeUpload(file: File, fileType: FileType): { isValid: boolean; error?: string } {
    try {
      this.validateFile(file, fileType);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Batch file validation
  validateMultipleFiles(files: File[], fileType?: FileType): Array<{ file: File; isValid: boolean; error?: string }> {
    return files.map(file => ({
      file,
      ...this.validateFileBeforeUpload(file, fileType!)
    }));
  }

  // Create file preview URL
  createFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  // Clean up preview URLs
  revokeFilePreview(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const uploadService = new UploadService();