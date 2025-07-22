'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SearchForm from './SearchForm'

const HeroSection: React.FC = () => {

  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 min-h-[600px] flex items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 opacity-80">
        <Image
          src="/hero-background.png"
          alt="Beautiful home background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center leading-tight">
            Encuentra tu{' '}
            <span className="text-red-400">hogar ideal</span>
          </h1>
          
                    {/* Search Form */}
          <SearchForm variant="hero" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection