# 🖼️ Property Image Upload Tool

This tool uploads images to existing properties in Strapi with standardized naming conventions.

## 📋 Requirements

- Property must already exist in Strapi (use `main.js` to create properties first)
- Images should be in supported formats: `jpg`, `jpeg`, `png`, `webp`, `gif`
- **Auto-renaming**: Images will be automatically renamed to `{documentId}-{index}.{extension}` if needed

## 🚀 Usage

### Basic Command
```bash
node upload-images.js <documentId> <imagesPath>
```

### Using NPM Script
```bash
npm run upload-images <documentId> <imagesPath>
```

## 📁 Image Organization

### Flexible Image Naming
The script automatically handles any image filenames - no manual renaming required!

**Before (any names work):**
```
property-images/
├── WhatsApp Image 2025-07-28 at 21.24.16.jpeg
├── IMG_1234.png
├── photo_2025_07_28.jpg
└── image (1).webp
```

**After (automatically renamed):**
```
property-images/
├── abc123defg456-1.jpeg
├── abc123defg456-2.png
├── abc123defg456-3.jpg
└── abc123defg456-4.webp
```

**Pattern:** `{documentId}-{index}.{extension}`
- `documentId`: The property's document ID from Strapi
- `index`: Sequential number starting from 1
- `extension`: Original file extension (jpg, png, etc.)

## 💡 Complete Workflow Example

### 1. Create Property First
```bash
# Create property and get documentId
node main.js "Se vende hermoso apartamento en Casco Viejo..."
# Output: ✅ Property created successfully with DocumentId: abc123defg456
```

### 2. Prepare Images
```bash
# Create directory and add any images
mkdir property-images
# Copy your images with any names:
# WhatsApp Image 2025-07-28.jpeg
# IMG_1234.png  
# photo.jpg
# (Script will automatically rename them)
```

### 3. Upload Images
```bash
# Upload all images for the property
node upload-images.js abc123defg456 ./property-images/
```

## 📊 Expected Output

```bash
🖼️  Starting image upload for property: abc123defg456
📁 Looking for images in: ./property-images/
✅ Found Spanish property: "Hermoso apartamento en Casco Viejo"
✅ Found English property: "Beautiful apartment in Casco Viejo"
⚠️  No images found matching the pattern: {documentId}-{index}.{extension}
🔍 Looking for any image files to rename...
📸 Found 3 image files that need renaming:
  1. WhatsApp Image 2025-07-28 at 21.24.16.jpeg
  2. WhatsApp Image 2025-07-28 at 21.24.17.jpeg
  3. WhatsApp Image 2025-07-28 at 21.24.18.jpeg
🏷️  Renaming images to match pattern...
  ✅ WhatsApp Image 2025-07-28 at 21.24.16.jpeg → abc123defg456-1.jpeg
  ✅ WhatsApp Image 2025-07-28 at 21.24.17.jpeg → abc123defg456-2.jpeg
  ✅ WhatsApp Image 2025-07-28 at 21.24.18.jpeg → abc123defg456-3.jpeg
✅ Renamed and found 3 images ready for upload
🔍 Checking for existing images in Strapi...
📤 Uploading: abc123defg456-1.jpeg
✅ Uploaded: abc123defg456-1.jpeg (ID: 45)
⏭️  Skipping: abc123defg456-2.jpeg (already exists, ID: 46)
📤 Uploading: abc123defg456-3.jpeg
⚠️  Upload failed (504), retrying in 2s... (attempt 1/3)
✅ Uploaded: abc123defg456-3.jpeg (ID: 47)
⏭️  Skipped 1 existing files: abc123defg456-2.jpeg
✅ Upload complete: 2 new, 1 skipped, 3 total
🔗 Linking images to Spanish property...
✅ Spanish property updated with 3 images (2 new)
🔗 Linking images to English property...
✅ English property updated with 3 images (2 new)
🔍 Verifying image linking...
📋 Spanish property (ID: 123): 3 images total
   - New images linked: ✅ Yes
📋 English property (ID: 124): 3 images total
   - New images linked: ✅ Yes
✅ Successfully associated 3 images with property abc123defg456

📊 Upload Summary:
──────────────────────────────────────────────────
🏠 Property Document ID: abc123defg456
📸 Images found: 3
🆕 New uploads: 2
⏭️  Skipped (existing): 1
❌ Failed uploads: 0
📎 Total linked to property: 3

🌐 Locale Information:
   🇪🇸 Spanish (es-419): ID 123 - "Hermoso apartamento en Casco Viejo"
   🇺🇸 English (en): ID 124 - "Beautiful apartment in Casco Viejo"

📋 Images linked to property:
  1. abc123defg456-1.jpeg (1920x1080) - ID: 45 🆕 (new)
  2. abc123defg456-2.jpeg (1600x900) - ID: 46 ⏭️  (existing)
  3. abc123defg456-3.jpeg (1280x720) - ID: 47 🆕 (new)

🎉 Process completed!
```

## ⚠️ Important Notes

### Dual-Locale Support
- **Both locales are automatically updated**: Images are linked to both Spanish (es-419) and English (en) versions
- **Same documentId, different internal IDs**: Each locale has its own internal Strapi ID but shares the documentId
- **Verification included**: Script confirms images are properly linked to both locales
- **English translation optional**: If English translation doesn't exist, only Spanish is updated

### File Size Limits
- Check your Strapi configuration for maximum file size
- Default is usually 200MB, but this can be configured

### Image Quality
- Images are uploaded as-is (no automatic compression)
- Consider optimizing images before upload for better performance

### Overwriting
- **New images are appended** to existing ones
- To replace all images, manually delete them in Strapi admin first

### Error Handling & Retries
- **Automatic retries**: 504, 502, 503, 408, 429 errors are retried up to 3 times
- **Exponential backoff**: 2s, 4s, 8s delays between retry attempts
- **Continue on failure**: If one image fails, others still process
- **Always link available images**: Property linking runs even if some uploads fail
- **Detailed reporting**: Shows exactly which images succeeded, failed, or were skipped

### Duplicate Prevention
- **Checks existing files**: Compares filenames with Strapi media library
- **Skips duplicates**: Won't re-upload files that already exist
- **Links existing files**: Existing images are still linked to the property
- **Efficient processing**: No bandwidth wasted on duplicate uploads

## 🔧 Environment Variables

Make sure your `.env` file contains:
```bash
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
DEFAULT_LOCALE=es-419
SECONDARY_LOCALE=en
```

## 🛠️ Troubleshooting

### "Property not found"
- Verify the documentId is correct
- Ensure the property exists in Strapi
- Check your STRAPI_API_TOKEN permissions

### "No images found"
- Verify image naming follows exact pattern: `{documentId}-{index}.{extension}`
- Check file extensions are supported
- Ensure images are in the specified directory

### "Upload failed"
- Check file size limits in Strapi
- Verify file permissions (images must be readable)
- Check network connection to Strapi

### Permission Errors
- Ensure your API token has upload permissions
- Check that the token has access to modify properties

### Network/Timeout Errors (504, 502, 503)
- **Script automatically retries** these errors up to 3 times
- **Large files**: Consider reducing image file sizes before upload
- **Slow connection**: Script will retry with exponential backoff
- **Server issues**: 504 errors are usually temporary Strapi server issues
- **Check Strapi logs**: If retries fail, check your Strapi server logs

### Upload Performance Tips
- **Resize large images**: 2MB+ images may timeout on slow connections
- **Check network**: Ensure stable internet connection
- **Strapi resources**: Make sure Strapi server has enough memory/CPU
- **Run during off-peak**: Avoid uploading during high server load

## 🔍 How Strapi v5 Localization Works

In Strapi v5 with internationalization:

```bash
# Same property in different locales
Spanish Property:  ID = 123, documentId = "abc123defg456", locale = "es-419"
English Property:  ID = 124, documentId = "abc123defg456", locale = "en"
```

The script automatically:
1. **Finds both versions** using the shared documentId
2. **Updates both locales** with the same images
3. **Verifies linking** by checking each locale individually
4. **Reports status** for both Spanish and English versions

## 📝 Script Features

- ✅ **Auto-renames any image files** to proper naming convention
- ✅ **Duplicate detection** - skips files already in Strapi
- ✅ **Automatic retries** for network errors (504, 502, 503, etc.)
- ✅ **Exponential backoff** retry strategy (2s, 4s, 8s delays)
- ✅ Validates documentId and directory exist
- ✅ Finds and sorts images by index automatically  
- ✅ Uploads to Strapi media library with 30s timeout
- ✅ **Associates with both Spanish and English properties**
- ✅ **Verifies dual-locale linking**
- ✅ **Robust error handling** - continues even if some uploads fail
- ✅ **Always runs linking** - uses available images even after failures
- ✅ **Detailed reporting** - shows new/skipped/failed counts
- ✅ Appends to existing images (doesn't replace)
- ✅ **Shows internal IDs for both locales**