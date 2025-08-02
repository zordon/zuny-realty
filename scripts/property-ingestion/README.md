# Property Ingestion Tool

This tool automates the ingestion of real estate property data from various sources into your Strapi backend.

## Features

- 🌐 **URL Scraping**: Extract data from real estate websites (Encuentra24, etc.)
- 📝 **Text Parsing**: Process unstructured text descriptions
- 🤖 **AI-Powered**: Uses Gemini Pro to parse and structure data
- 🌍 **Multilingual**: Automatic Spanish to English translation
- 🔄 **Deduplication**: Avoids creating duplicate features and categories
- 📊 **Batch Processing**: Handle multiple properties at once
- 🏗️ **Relationship Management**: Properly handles Strapi relationships

## Installation

1. Navigate to the scripts directory:
```bash
cd scripts/property-ingestion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

### Required Environment Variables

- `STRAPI_URL`: Your Strapi backend URL (e.g., http://localhost:1337)
- `STRAPI_API_TOKEN`: Your Strapi API token with write permissions
- `GEMINI_API_KEY`: Your Google Gemini Pro API key

### Getting API Keys

1. **Strapi API Token**: 
   - Go to Settings → API Tokens in your Strapi admin
   - Create a new token with "Full access" permissions

2. **Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

## Usage

### Basic Usage

```bash
# Process a single URL
node main.js "https://www.encuentra24.com/panama-es/..."

# Process text description
node main.js "Se vende hermoso dúplex en El Avance 1, Bethania..."

# Process multiple sources
node main.js url1 "text description" file.txt
```

### Advanced Usage

```bash
# Process from files
node main.js properties.txt listings.json

# Batch process with custom settings
BATCH_SIZE=3 node main.js url1 url2 url3 url4 url5

# Run examples
npm run examples
```

## Supported Sources

### URLs
- ✅ Encuentra24.com
- ✅ Generic real estate websites
- 🔄 Custom parsers can be added

### Text Formats
- ✅ WhatsApp messages
- ✅ Email descriptions
- ✅ Social media posts
- ✅ Any unstructured text

### File Formats
- ✅ Plain text (.txt)
- ✅ JSON (.json)
- 🔄 CSV support coming soon

## Data Structure

The tool extracts and organizes:

- **Basic Info**: Title, description, price, currency
- **Property Details**: Bedrooms, bathrooms, area, type
- **Location**: Address, neighborhood, city
- **Features**: Amenities and property features
- **Characteristics**: Measurable attributes (area, parking, etc.)
- **Images**: Property photos (when available)

## Examples

### Example 1: Encuentra24 URL
```bash
node main.js "https://www.encuentra24.com/panama-es/bienes-raices-venta-de-propiedades-apartamentos/vista-del-mar-29f-venta-full-amoblado-vista-ciudad-114mts-2recs-2b-area-bancaria/30740922"
```

### Example 2: WhatsApp Text
```bash
node main.js "Se vende hermoso y espacioso dúplex en El Avance 1, Bethania de 430 mts. Distribución en la Planta Baja: -Recibidor. -Baño de visita. -Espaciosa sala -Comedor... Precio de venta US$410k"
```

### Example 3: Batch Processing
```bash
# Create a file with multiple sources
echo "https://encuentra24.com/property1" > batch.txt
echo "Se vende casa en Casco Viejo..." >> batch.txt
echo "https://encuentra24.com/property2" >> batch.txt

node main.js batch.txt
```

## Troubleshooting

### Common Issues

1. **Missing API Keys**: Ensure all environment variables are set
2. **Strapi Connection**: Verify Strapi is running and accessible
3. **Rate Limits**: The tool includes delays to respect API limits
4. **Parsing Errors**: Check that the input data is properly formatted

### Debug Mode

```bash
DEBUG=* node main.js "your property data"
```

## Customization

### Adding Custom Parsers

Create a new parser in `parsers/` directory:

```javascript
// parsers/custom-site.js
class CustomSiteParser {
  static canHandle(url) {
    return url.includes('custom-site.com');
  }
  
  static async parse(html, url) {
    // Custom parsing logic
    return propertyData;
  }
}
```

### Modifying Feature Mapping

Edit `config.js` to add custom feature translations:

```javascript
FEATURE_MAPPING: {
  'custom_feature_spanish': 'custom_feature_english',
  // ... more mappings
}
```

## Contributing

1. Add new parsers for different websites
2. Improve AI prompts for better extraction
3. Add support for more file formats
4. Enhance error handling and logging

## License

This tool is part of the Zuny Real Estate project.