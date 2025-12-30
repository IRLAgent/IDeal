import request from 'supertest';
import express from 'express';
import cors from 'cors';
import uploadRoutes from '../routes/upload';
import { createTestUser, generateTestToken } from './setup';
import { deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs';
import path from 'path';

// Create test Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', uploadRoutes);

describe('POST /api/upload - Cloudinary Integration', () => {
  let testUser: any;
  let testToken: string;
  let uploadedPublicIds: string[] = [];

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'uploader@test.com',
      name: 'Test Uploader',
    });
    testToken = generateTestToken(testUser.id);
    uploadedPublicIds = [];
  });

  afterEach(async () => {
    // Clean up uploaded files from Cloudinary
    for (const publicId of uploadedPublicIds) {
      try {
        await deleteFromCloudinary(publicId);
        console.log(`✓ Cleaned up: ${publicId}`);
      } catch (error) {
        console.error(`Failed to cleanup ${publicId}:`, error);
      }
    }
    uploadedPublicIds = [];
  });

  it('should upload a single image to Cloudinary', async () => {
    // Create a test image buffer (1x1 red PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`)
      .attach('files', testImageBuffer, 'test-image.png');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('urls');
    expect(Array.isArray(response.body.urls)).toBe(true);
    expect(response.body.urls.length).toBe(1);
    expect(response.body.urls[0]).toMatch(/^https:\/\/res\.cloudinary\.com/);
    expect(response.body.urls[0]).toContain('ideal-carmarket');

    // Extract public_id from URL for cleanup
    const urlParts = response.body.urls[0].split('/');
    const publicIdWithExt = urlParts.slice(urlParts.indexOf('ideal-carmarket')).join('/');
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, ''); // Remove extension
    uploadedPublicIds.push(publicId);
  }, 30000); // 30 second timeout for network request

  it('should upload multiple images to Cloudinary', async () => {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`)
      .attach('files', testImageBuffer, 'test-image-1.png')
      .attach('files', testImageBuffer, 'test-image-2.png')
      .attach('files', testImageBuffer, 'test-image-3.png');

    expect(response.status).toBe(200);
    expect(response.body.urls.length).toBe(3);
    response.body.urls.forEach((url: string) => {
      expect(url).toMatch(/^https:\/\/res\.cloudinary\.com/);
      expect(url).toContain('ideal-carmarket');
      
      // Extract public_id for cleanup
      const urlParts = url.split('/');
      const publicIdWithExt = urlParts.slice(urlParts.indexOf('ideal-carmarket')).join('/');
      const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
      uploadedPublicIds.push(publicId);
    });
  }, 30000);

  it('should reject upload without authentication', async () => {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request(app)
      .post('/api/upload')
      .attach('files', testImageBuffer, 'test-image.png');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject upload with invalid token', async () => {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', 'Bearer invalid-token')
      .attach('files', testImageBuffer, 'test-image.png');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject upload with no files', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('No files provided');
  });

  it('should reject non-image files', async () => {
    const textFileBuffer = Buffer.from('This is a text file, not an image');

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`)
      .attach('files', textFileBuffer, 'test-file.txt');

    // Multer rejects with 500 status when file filter fails
    expect(response.status).toBe(500);
    // Error might be in response.error or response.body.error
    expect(response.error || response.body.error).toBeTruthy();
  });

  it('should handle JPEG images', async () => {
    // Minimal valid JPEG (1x1 red pixel)
    const jpegBuffer = Buffer.from(
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==',
      'base64'
    );

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`)
      .attach('files', jpegBuffer, 'test-image.jpg');

    expect(response.status).toBe(200);
    expect(response.body.urls.length).toBe(1);
    expect(response.body.urls[0]).toContain('ideal-carmarket');

    // Cleanup
    const urlParts = response.body.urls[0].split('/');
    const publicIdWithExt = urlParts.slice(urlParts.indexOf('ideal-carmarket')).join('/');
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
    uploadedPublicIds.push(publicId);
  }, 30000);

  it('should store uploaded images in ideal-carmarket folder', async () => {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`)
      .attach('files', testImageBuffer, 'folder-test.png');

    expect(response.status).toBe(200);
    expect(response.body.urls[0]).toContain('/ideal-carmarket/');

    // Cleanup
    const urlParts = response.body.urls[0].split('/');
    const publicIdWithExt = urlParts.slice(urlParts.indexOf('ideal-carmarket')).join('/');
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
    uploadedPublicIds.push(publicId);
  }, 30000);
});

describe('Cloudinary Delete Function', () => {
  let testUser: any;
  let testToken: string;

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'deleter@test.com',
      name: 'Test Deleter',
    });
    testToken = generateTestToken(testUser.id);
  });

  it('should successfully delete an uploaded image', async () => {
    // First upload an image
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api', uploadRoutes);

    const uploadResponse = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${testToken}`)
      .attach('files', testImageBuffer, 'delete-test.png');

    expect(uploadResponse.status).toBe(200);

    // Extract public_id
    const url = uploadResponse.body.urls[0];
    const urlParts = url.split('/');
    const publicIdWithExt = urlParts.slice(urlParts.indexOf('ideal-carmarket')).join('/');
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');

    // Now delete it
    await expect(deleteFromCloudinary(publicId)).resolves.not.toThrow();

    // Try to delete again - should not throw (already deleted)
    await expect(deleteFromCloudinary(publicId)).resolves.not.toThrow();
  }, 30000);
});
