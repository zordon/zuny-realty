#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'es-419',
  SECONDARY_LOCALE: process.env.SECONDARY_LOCALE || 'en'
};

class PropertyImageUploader {
  constructor() {
    this.strapiAPI = axios.create({
      baseURL: CONFIG.STRAPI_URL,
      headers: {
        'Authorization': `Bearer ${CONFIG.STRAPI_API_TOKEN}`
      },
      timeout: 60000 // 60 second timeout for regular API calls
    });
  }

  async uploadImages(documentId, imagesPath) {
    console.log(`🖼️  Starting image upload for property: ${documentId}`);
    console.log(`📁 Looking for images in: ${imagesPath}`);

    try {
      // Validate inputs
      await this.validateInputs(documentId, imagesPath);

      // Find property to ensure it exists
      const propertyData = await this.findProperty(documentId);
      console.log(`✅ Found Spanish property: "${propertyData.spanish.title}"`);
      if (propertyData.english) {
        console.log(`✅ Found English property: "${propertyData.english.title}"`);
      }

      // Find and validate images
      let imageFiles = await this.findImages(documentId, imagesPath);
      
      if (imageFiles.length === 0) {
        console.log('⚠️  No images found matching the pattern: {documentId}-{index}.{extension}');
        console.log('🔍 Looking for any image files to rename...');
        
        // Try to find any image files and offer to rename them
        const anyImages = await this.findAnyImageFiles(imagesPath);
        if (anyImages.length > 0) {
          console.log(`📸 Found ${anyImages.length} image files that need renaming:`);
          anyImages.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file.filename}`);
          });
          
          console.log('🏷️  Renaming images to match pattern...');
          await this.renameImagesToPattern(documentId, anyImages, imagesPath);
          
          // Re-scan for images after renaming
          imageFiles = await this.findImages(documentId, imagesPath);
          console.log(`✅ Renamed and found ${imageFiles.length} images ready for upload`);
        } else {
          console.log('❌ No image files found in the directory');
          return;
        }
      } else {
        console.log(`📸 Found ${imageFiles.length} images to upload`);
      }

      // Upload images to Strapi
      const uploadedFiles = await this.uploadFilesToStrapi(imageFiles);
      const newUploads = uploadedFiles.filter(f => !f.wasSkipped);
      const skippedUploads = uploadedFiles.filter(f => f.wasSkipped);
      
      console.log(`✅ Upload complete: ${newUploads.length} new, ${skippedUploads.length} skipped, ${uploadedFiles.length} total`);

      // Associate images with property (even if some uploads failed)
      if (uploadedFiles.length > 0) {
        await this.associateImagesWithProperty(documentId, uploadedFiles, propertyData);
        console.log(`✅ Successfully associated ${uploadedFiles.length} images with property ${documentId}`);
      } else {
        console.log('⚠️  No images to associate with property');
      }

      // Display summary
      this.displaySummary(documentId, imageFiles, uploadedFiles, propertyData);

    } catch (error) {
      console.error('❌ Error uploading images:', error.message);
      throw error;
    }
  }

  async validateInputs(documentId, imagesPath) {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    if (!imagesPath) {
      throw new Error('Images path is required');
    }

    if (!CONFIG.STRAPI_API_TOKEN) {
      throw new Error('STRAPI_API_TOKEN environment variable is required');
    }

    // Check if directory exists
    try {
      const stats = await fs.stat(imagesPath);
      if (!stats.isDirectory()) {
        throw new Error(`Path is not a directory: ${imagesPath}`);
      }
    } catch (error) {
      throw new Error(`Directory not found: ${imagesPath}`);
    }
  }

  async findProperty(documentId) {
    try {
      // Get both Spanish and English versions
      const spanishResponse = await this.strapiAPI.get(`/api/properties/${documentId}?locale=${CONFIG.DEFAULT_LOCALE}`);
      const spanishProperty = spanishResponse.data.data;

      let englishProperty = null;
      try {
        const englishResponse = await this.strapiAPI.get(`/api/properties/${documentId}?locale=${CONFIG.SECONDARY_LOCALE}`);
        englishProperty = englishResponse.data.data;
      } catch (error) {
        console.log(`⚠️  English translation not found for documentId: ${documentId}`);
      }

      return {
        spanish: spanishProperty,
        english: englishProperty,
        documentId: documentId
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Property with documentId "${documentId}" not found in Spanish locale`);
      }
      throw new Error(`Error finding property: ${error.message}`);
    }
  }

  async findImages(documentId, imagesPath) {
    try {
      const files = await fs.readdir(imagesPath);
      
      // Filter files that match the pattern: documentId-index.extension
      const imagePattern = new RegExp(`^${documentId}-(\\d+)\\.(jpg|jpeg|png|webp|gif)$`, 'i');
      
      const imageFiles = files
        .filter(file => imagePattern.test(file))
        .map(file => {
          const match = file.match(imagePattern);
          return {
            filename: file,
            fullPath: path.join(imagesPath, file),
            index: parseInt(match[1]),
            extension: match[2].toLowerCase()
          };
        })
        .sort((a, b) => a.index - b.index); // Sort by index

      // Validate that images exist and are readable
      for (const image of imageFiles) {
        try {
          await fs.access(image.fullPath);
        } catch (error) {
          console.warn(`⚠️  Cannot access image: ${image.fullPath}`);
        }
      }

      return imageFiles;
    } catch (error) {
      throw new Error(`Error reading images directory: ${error.message}`);
    }
  }

  async findAnyImageFiles(imagesPath) {
    try {
      const files = await fs.readdir(imagesPath);
      const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      
      const imageFiles = [];
      for (const file of files) {
        const fullPath = path.join(imagesPath, file);
        const stats = await fs.stat(fullPath);
        
        // Skip directories
        if (stats.isDirectory()) continue;
        
        // Check if it's an image file
        const extension = path.extname(file).toLowerCase().substring(1);
        if (supportedExtensions.includes(extension)) {
          imageFiles.push({
            filename: file,
            fullPath: fullPath,
            extension: extension
          });
        }
      }

      // Sort by name to ensure consistent ordering
      imageFiles.sort((a, b) => a.filename.localeCompare(b.filename));
      return imageFiles;
    } catch (error) {
      throw new Error(`Error reading directory for any images: ${error.message}`);
    }
  }

  async renameImagesToPattern(documentId, imageFiles, imagesPath) {
    const renameOperations = [];
    
    // Generate rename operations
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const newFilename = `${documentId}-${i + 1}.${file.extension}`;
      const newPath = path.join(imagesPath, newFilename);
      
      renameOperations.push({
        oldPath: file.fullPath,
        newPath: newPath,
        oldName: file.filename,
        newName: newFilename
      });
    }

    // Check for naming conflicts
    for (const operation of renameOperations) {
      try {
        await fs.access(operation.newPath);
        throw new Error(`File already exists: ${operation.newName}. Please remove conflicting files first.`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error; // Re-throw if it's not a "file not found" error
        }
        // File doesn't exist, which is what we want
      }
    }

    // Perform the renames
    for (const operation of renameOperations) {
      try {
        await fs.rename(operation.oldPath, operation.newPath);
        console.log(`  ✅ ${operation.oldName} → ${operation.newName}`);
      } catch (error) {
        throw new Error(`Failed to rename ${operation.oldName}: ${error.message}`);
      }
    }
  }

  async uploadFilesToStrapi(imageFiles) {
    const uploadedFiles = [];
    const skippedFiles = [];

    // Check for existing files first
    console.log('🔍 Checking for existing images in Strapi...');
    const existingFiles = await this.getExistingFiles();
    
    for (const image of imageFiles) {
      try {
        // Check if file already exists
        const existingFile = this.findExistingFile(image.filename, existingFiles);
        if (existingFile) {
          console.log(`⏭️  Skipping: ${image.filename} (already exists, ID: ${existingFile.id})`);
          uploadedFiles.push({
            ...existingFile,
            originalIndex: image.index,
            wasSkipped: true
          });
          skippedFiles.push(image.filename);
          continue;
        }

        console.log(`📤 Uploading: ${image.filename}`);
        
        const uploadedFile = await this.uploadSingleFileWithRetry(image);
        uploadedFiles.push({
          ...uploadedFile,
          originalIndex: image.index,
          wasSkipped: false
        });

        console.log(`✅ Uploaded: ${image.filename} (ID: ${uploadedFile.id})`);

      } catch (error) {
        console.error(`❌ Failed to upload ${image.filename} after retries:`, error.message);
        // Continue with other images even if one fails
      }
    }

    if (skippedFiles.length > 0) {
      console.log(`⏭️  Skipped ${skippedFiles.length} existing files: ${skippedFiles.join(', ')}`);
    }

    return uploadedFiles;
  }

  async getExistingFiles() {
    try {
      // Get all existing files from Strapi
      const response = await this.strapiAPI.get('/api/upload/files?pagination[pageSize]=1000');
      return response.data.data || [];
    } catch (error) {
      console.log('⚠️  Could not fetch existing files, will upload all images');
      return [];
    }
  }

  findExistingFile(filename, existingFiles) {
    return existingFiles.find(file => file.name === filename);
  }

  async uploadSingleFileWithRetry(image, maxRetries = 3) {
    const retryableErrors = [504, 502, 503, 408, 429]; // Gateway timeout, bad gateway, service unavailable, timeout, rate limit
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const formData = new FormData();
        const fileStream = await fs.readFile(image.fullPath);
        
        formData.append('files', fileStream, {
          filename: image.filename,
          contentType: this.getContentType(image.extension)
        });

        const response = await this.strapiAPI.post('/api/upload', formData, {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 30000 // 30 second timeout
        });

        return response.data[0];

      } catch (error) {
        const statusCode = error.response?.status;
        const isRetryable = retryableErrors.includes(statusCode) || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT';
        
        if (attempt < maxRetries && isRetryable) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(`⚠️  Upload failed (${statusCode || error.code}), retrying in ${delay/1000}s... (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
  }

  async associateImagesWithProperty(documentId, uploadedFiles, propertyData) {
    try {
      const newImageIds = uploadedFiles.map(file => file.id);
      const results = {};

      // Update Spanish locale
      console.log('🔗 Linking images to Spanish property...');
      const spanishResult = await this.updatePropertyImages(documentId, CONFIG.DEFAULT_LOCALE, newImageIds);
      results.spanish = spanishResult;
      console.log(`✅ Spanish property updated with ${spanishResult.totalImages} images (${newImageIds.length} new)`);

      // Update English locale if it exists
      if (propertyData.english) {
        console.log('🔗 Linking images to English property...');
        const englishResult = await this.updatePropertyImages(documentId, CONFIG.SECONDARY_LOCALE, newImageIds);
        results.english = englishResult;
        console.log(`✅ English property updated with ${englishResult.totalImages} images (${newImageIds.length} new)`);
      } else {
        console.log('⚠️  English translation not found - images only linked to Spanish property');
        results.english = null;
      }

      // Verify the linking worked
      await this.verifyImageLinking(documentId, newImageIds, propertyData);

      return results;
    } catch (error) {
      throw new Error(`Error associating images with property: ${error.message}`);
    }
  }

  async updatePropertyImages(documentId, locale, newImageIds) {
    try {
      // Get current images for this locale
      const currentProperty = await this.strapiAPI.get(`/api/properties/${documentId}?locale=${locale}&populate=images`);
      const existingImageIds = currentProperty.data.data.images?.map(img => img.id) || [];
      
      // Combine existing and new images
      const allImageIds = [...existingImageIds, ...newImageIds];

      // Update property with all images
      await this.strapiAPI.put(`/api/properties/${documentId}?locale=${locale}`, {
        data: {
          images: allImageIds
        }
      });

      return {
        locale: locale,
        existingImages: existingImageIds.length,
        newImages: newImageIds.length,
        totalImages: allImageIds.length,
        propertyId: currentProperty.data.data.id,
        documentId: currentProperty.data.data.documentId
      };
    } catch (error) {
      throw new Error(`Error updating images for locale ${locale}: ${error.message}`);
    }
  }

  async verifyImageLinking(documentId, uploadedImageIds, propertyData) {
    console.log('🔍 Verifying image linking...');
    
    try {
      // Verify Spanish locale
      const spanishCheck = await this.strapiAPI.get(`/api/properties/${documentId}?locale=${CONFIG.DEFAULT_LOCALE}&populate=images`);
      const spanishImages = spanishCheck.data.data.images?.map(img => img.id) || [];
      const spanishLinked = uploadedImageIds.every(id => spanishImages.includes(id));
      
      console.log(`📋 Spanish property (ID: ${spanishCheck.data.data.id}): ${spanishImages.length} images total`);
      console.log(`   - New images linked: ${spanishLinked ? '✅ Yes' : '❌ No'}`);

      // Verify English locale if it exists
      if (propertyData.english) {
        const englishCheck = await this.strapiAPI.get(`/api/properties/${documentId}?locale=${CONFIG.SECONDARY_LOCALE}&populate=images`);
        const englishImages = englishCheck.data.data.images?.map(img => img.id) || [];
        const englishLinked = uploadedImageIds.every(id => englishImages.includes(id));
        
        console.log(`📋 English property (ID: ${englishCheck.data.data.id}): ${englishImages.length} images total`);
        console.log(`   - New images linked: ${englishLinked ? '✅ Yes' : '❌ No'}`);

        return { spanish: spanishLinked, english: englishLinked };
      }

      return { spanish: spanishLinked, english: null };
    } catch (error) {
      console.log(`⚠️  Could not verify image linking: ${error.message}`);
      return { spanish: false, english: false };
    }
  }

  getContentType(extension) {
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif'
    };
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  displaySummary(documentId, imageFiles, uploadedFiles, propertyData) {
    const newUploads = uploadedFiles.filter(f => !f.wasSkipped);
    const skippedUploads = uploadedFiles.filter(f => f.wasSkipped);
    const failedUploads = imageFiles.length - uploadedFiles.length;

    console.log('\n📊 Upload Summary:');
    console.log('─'.repeat(50));
    console.log(`🏠 Property Document ID: ${documentId}`);
    console.log(`📸 Images found: ${imageFiles.length}`);
    console.log(`🆕 New uploads: ${newUploads.length}`);
    console.log(`⏭️  Skipped (existing): ${skippedUploads.length}`);
    console.log(`❌ Failed uploads: ${failedUploads}`);
    console.log(`📎 Total linked to property: ${uploadedFiles.length}`);
    
    // Show locale-specific information
    if (propertyData) {
      console.log('\n🌐 Locale Information:');
      console.log(`   🇪🇸 Spanish (${CONFIG.DEFAULT_LOCALE}): ID ${propertyData.spanish.id} - "${propertyData.spanish.title}"`);
      if (propertyData.english) {
        console.log(`   🇺🇸 English (${CONFIG.SECONDARY_LOCALE}): ID ${propertyData.english.id} - "${propertyData.english.title}"`);
      } else {
        console.log(`   🇺🇸 English (${CONFIG.SECONDARY_LOCALE}): ❌ Not found`);
      }
    }
    
    if (uploadedFiles.length > 0) {
      console.log('\n📋 Images linked to property:');
      uploadedFiles.forEach((file, index) => {
        const status = file.wasSkipped ? '⏭️  (existing)' : '🆕 (new)';
        console.log(`  ${index + 1}. ${file.name} (${file.width}x${file.height}) - ID: ${file.id} ${status}`);
      });
    }

    if (failedUploads > 0) {
      console.log(`\n⚠️  ${failedUploads} images failed to upload. Check the logs above for details.`);
    }

    console.log('\n🎉 Process completed!');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.log(`
🖼️  Property Image Uploader

Usage:
  node upload-images.js <documentId> <imagesPath>

Arguments:
  documentId    Document ID of the property in Strapi
  imagesPath    Path to directory containing images

Image Naming:
  • Preferred: {documentId}-{index}.{extension} (abc123-1.jpg, abc123-2.png)
  • Auto-rename: If images don't match pattern, script will rename them automatically
  
Examples:
  abc123-1.jpg  ← Already correctly named
  abc123-2.png  ← Already correctly named
  
  WhatsApp Image 2025-07-28.jpeg  ← Will be renamed to abc123-1.jpeg
  IMG_1234.png                    ← Will be renamed to abc123-2.png

Supported formats: jpg, jpeg, png, webp, gif

Environment Variables:
  STRAPI_URL=http://localhost:1337
  STRAPI_API_TOKEN=your_strapi_token

Example:
  node upload-images.js abc123defg456 ./property-images/
    `);
    process.exit(1);
  }

  const [documentId, imagesPath] = args;

  const uploader = new PropertyImageUploader();
  await uploader.uploadImages(documentId, imagesPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PropertyImageUploader };