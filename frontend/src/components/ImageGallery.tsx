import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altText }) => {
  const { t } = useTranslation();
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return <p>{t('imageGallery.noImages')}</p>;
  }

  return (
    <div className="mb-8">
      <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
        <Image 
          src={mainImage} 
          alt={t('imageGallery.mainViewAlt', { altText })}
          className="w-full h-auto max-h-[600px] object-cover transition-opacity duration-300"
          width={1200} 
          height={600} 
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
                              className={`rounded-md overflow-hidden border-2 transition-all duration-200 ${mainImage === image ? 'border-yellow-500 scale-105' : 'border-transparent hover:border-yellow-300'}`}
              aria-label={t('imageGallery.thumbnailAlt', {altText, index: index + 1})}
            >
              <Image 
                src={image} 
                alt={t('imageGallery.thumbnailAlt', {altText, index: index + 1})}
                className="w-full h-20 object-cover " 
                width={100}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;