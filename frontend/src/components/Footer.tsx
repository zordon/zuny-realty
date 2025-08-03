'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dictionary } from '@/lib/dictionaries'

interface FooterProps {
  dict: Dictionary;
  lang: 'en' | 'es';
}

const Footer: React.FC<FooterProps> = ({ dict, lang }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
                              <div className="h-14 w-auto overflow-hidden">
                                <Image 
                                  src="/logo.png" 
                                  alt="ZuR Real Estate" 
                                  width={100}
                                  height={50}
                                  className="h-16 w-auto object-contain filter brightness-0 invert scale-125 transform-gpu -translate-y-1 relative top-1"
                                />
                              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {dict.footer.companyDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${lang}`} className="text-gray-300 hover:text-white transition-colors">{dict.nav.home}</Link></li>
              <li><Link href={`/${lang}/properties`} className="text-gray-300 hover:text-white transition-colors">{dict.nav.properties}</Link></li>
              <li><Link href={`/${lang}/about`} className="text-gray-300 hover:text-white transition-colors">{dict.nav.about}</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-gray-300 hover:text-white transition-colors">{dict.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{dict.footer.contact}</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +507 6617-7498
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                admin@zunyrealty.com
              </p>
              <p className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                San Francisco, Ciudad de Panamá
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer