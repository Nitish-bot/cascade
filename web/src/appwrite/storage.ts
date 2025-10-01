import { storage, BUCKET_ID } from '@/appwrite/config';

export async function uploadImage(file: File, id: string): Promise<string> {
  try {
    const response = await storage.createFile({
      bucketId: BUCKET_ID,
      fileId: id,
      file: file,
    });
    console.log('File uploaded successfully:', response);
    return response.$id;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function getImageUrl(fileId: string): Promise<string> {
  try {
    const url = await storage.getFilePreview({
      bucketId: BUCKET_ID,
      fileId: fileId,
    });
    console.log(url);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}
