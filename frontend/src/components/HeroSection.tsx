'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 min-h-[600px] flex items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 opacity-30">
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
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Encuentra tu{' '}
            <span className="text-yellow-400">hogar ideal</span>{' '}
            en Panamá
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
            Servicio personalizado y profesional para ayudarte a encontrar la propiedad perfecta
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-bold text-lg rounded-lg hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Explorar Propiedades
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-200 shadow-lg"
            >
              Contáctanos
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400 mb-1">300+</div>
              <div className="text-blue-700 text-sm font-medium">Propiedades</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400 mb-1">5+</div>
              <div className="text-blue-700 text-sm font-medium">Años de Experiencia</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400 mb-1">500+</div>
              <div className="text-blue-700 text-sm font-medium">Clientes Satisfechos</div>
            </div>
          </div>
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