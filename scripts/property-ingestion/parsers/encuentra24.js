const cheerio = require('cheerio');

class Encuentra24Parser {
  static canHandle(url) {
    return url.includes('encuentra24.com');
  }

  static async parse(html, url) {
    const $ = cheerio.load(html);
    
    const data = {
      source: 'encuentra24',
      url: url,
      title: this.extractTitle($),
      price: this.extractPrice($),
      currency: this.extractCurrency($),
      location: this.extractLocation($),
      bedrooms: this.extractBedrooms($),
      bathrooms: this.extractBathrooms($),
      area: this.extractArea($),
      description: this.extractDescription($),
      features: this.extractFeatures($),
      characteristics: this.extractCharacteristics($),
      images: this.extractImages($),
      propertyType: this.extractPropertyType($),
      category: this.extractCategory($)
    };

    return data;
  }

  static extractTitle($) {
    return $('h1').first().text().trim() || 
           $('title').text().replace(/\s*\|\s*Encuentra24.*/, '').trim();
  }

  static extractPrice($) {
    const priceText = $('[class*="price"], .price, #price').first().text();
    const match = priceText.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : null;
  }

  static extractCurrency($) {
    const priceText = $('[class*="price"], .price, #price').first().text();
    if (priceText.includes('B/.') || priceText.includes('PAB')) return 'PAB';
    if (priceText.includes('$') || priceText.includes('USD')) return 'USD';
    return 'USD'; // default
  }

  static extractLocation($) {
    const breadcrumb = $('.breadcrumb, [class*="breadcrumb"]').text();
    const location = $('[class*="location"], [class*="address"]').text().trim();
    return location || breadcrumb || '';
  }

  static extractBedrooms($) {
    const text = $('body').text();
    const bedroomMatch = text.match(/(\d+)\s*(?:rec[aá]mar|bedroom|habitaci[oó]n)/i);
    return bedroomMatch ? parseInt(bedroomMatch[1]) : 0;
  }

  static extractBathrooms($) {
    const text = $('body').text();
    const bathroomMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ba[ñn]o|bathroom)/i);
    return bathroomMatch ? parseFloat(bathroomMatch[1]) : 0;
  }

  static extractArea($) {
    const text = $('body').text();
    const areaMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m²|mt²|metros|square)/i);
    return areaMatch ? parseFloat(areaMatch[1]) : null;
  }

  static extractDescription($) {
    const description = $('.description, [class*="description"], .details, [class*="detail"]')
      .first().text().trim();
    return description || $('meta[name="description"]').attr('content') || '';
  }

  static extractFeatures($) {
    const features = [];
    
    // Look for benefit/feature sections
    $('[class*="benefit"], [class*="feature"], [class*="amenity"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 2) {
        features.push(text);
      }
    });

    // Look in description for common features
    const description = this.extractDescription($);
    const commonFeatures = [
      'piscina', 'gimnasio', 'seguridad', 'estacionamiento', 'balcón', 
      'terraza', 'jardín', 'aire acondicionado', 'ascensor', 'portero'
    ];

    commonFeatures.forEach(feature => {
      if (description.toLowerCase().includes(feature)) {
        features.push(feature);
      }
    });

    return [...new Set(features)]; // Remove duplicates
  }

  static extractCharacteristics($) {
    const characteristics = [];
    
    // Extract area
    const area = this.extractArea($);
    if (area) {
      characteristics.push({
        key: 'area',
        label: 'Área',
        value: area.toString(),
        suffix: 'm²'
      });
    }

    // Extract parking
    const text = $('body').text();
    const parkingMatch = text.match(/(\d+)\s*(?:estacionamiento|parking)/i);
    if (parkingMatch) {
      characteristics.push({
        key: 'parking',
        label: 'Estacionamiento',
        value: parkingMatch[1],
        suffix: 'espacios'
      });
    }

    // Extract floor
    const floorMatch = text.match(/piso\s*(\d+)/i);
    if (floorMatch) {
      characteristics.push({
        key: 'floor',
        label: 'Piso',
        value: floorMatch[1],
        suffix: ''
      });
    }

    return characteristics;
  }

  static extractImages($) {
    const images = [];
    $('img[src*="property"], img[src*="inmueble"], .property-image img, .gallery img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('logo') && !src.includes('icon')) {
        images.push(src);
      }
    });
    return images;
  }

  static extractPropertyType($) {
    const text = $('body').text().toLowerCase();
    if (text.includes('alquiler') || text.includes('rent')) return 'rent';
    if (text.includes('venta') || text.includes('sale')) return 'sale';
    return 'sale'; // default
  }

  static extractCategory($) {
    const text = $('body').text().toLowerCase();
    const breadcrumb = $('.breadcrumb, [class*="breadcrumb"]').text().toLowerCase();
    const fullText = (text + ' ' + breadcrumb).toLowerCase();

    if (fullText.includes('apartamento')) return 'apartamento';
    if (fullText.includes('casa')) return 'casa';
    if (fullText.includes('duplex') || fullText.includes('dúplex')) return 'duplex';
    if (fullText.includes('lote') || fullText.includes('terreno')) return 'lote';
    if (fullText.includes('oficina')) return 'oficina';
    if (fullText.includes('local')) return 'local comercial';
    
    return 'apartamento'; // default
  }
}

module.exports = Encuentra24Parser;