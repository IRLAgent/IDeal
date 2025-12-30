import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Track if Cloudinary has been configured
let isConfigured = false;

// Configure Cloudinary lazily (only when first needed)
function ensureCloudinaryConfigured() {
  if (isConfigured) {
    return;
  }

  // Debug: Log ALL environment variables related to Cloudinary
  console.log('🔍 Environment Variables Check:');
  console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
  console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '****' : undefined);
  console.log('   All env keys:', Object.keys(process.env).filter(k => k.includes('CLOUDINARY')));

  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };
  
  // Configure Cloudinary
  cloudinary.config(config);
  isConfigured = true;

  // Debug logging
  console.log('🔧 Cloudinary Configuration Applied:');
  console.log('   Cloud Name:', config.cloud_name ? '✓ Set' : '✗ Missing');
  console.log('   API Key:', config.api_key ? '✓ Set' : '✗ Missing');
  console.log('   API Secret:', config.api_secret ? '✓ Set' : '✗ Missing');
}

export interface UploadResponse {
  url: string;
  publicId: string;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  filename: string
): Promise<UploadResponse> {
  // Ensure Cloudinary is configured before use
  ensureCloudinaryConfigured();

  // Validate configuration
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(`Cloudinary config incomplete: cloud_name=${process.env.CLOUDINARY_CLOUD_NAME}, api_key=${process.env.CLOUDINARY_API_KEY ? 'set' : 'missing'}, api_secret=${process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing'}`);
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
  // Ensure Cloudinary is configured before use
  ensureCloudinaryConfigured();
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}
