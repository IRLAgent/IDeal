import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary - apply config on every function call to ensure env vars are loaded
function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
}

// Configure Cloudinary at startup
cloudinary.config(getCloudinaryConfig());

// Debug logging
console.log('🔧 Cloudinary Configuration:');
console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');

export interface UploadResponse {
  url: string;
  publicId: string;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  filename: string
): Promise<UploadResponse> {
  // Re-apply config before each upload to ensure credentials are available
  const config = getCloudinaryConfig();
  if (!config.api_key || !config.cloud_name || !config.api_secret) {
    throw new Error(`Cloudinary config incomplete: cloud_name=${config.cloud_name}, api_key=${config.api_key ? 'set' : 'missing'}, api_secret=${config.api_secret ? 'set' : 'missing'}`);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ideal-carmarket',
        resource_type: 'auto',
        filename_override: filename,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    // Convert buffer to stream and pipe it
    const bufferStream = Readable.from(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}
