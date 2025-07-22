'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Header: React.FC = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/properties', label: 'Propiedades' },
    { href: '/about', label: 'Acerca de' },
    { href: '/contact', label: 'Contacto' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="ZuR Real Estate" 
              width={180}
              height={90}
              className="h-16 w-auto"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 hidden sm:block">Tu hogar ideal te espera</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-yellow-700 bg-yellow-50 border-b-2 border-yellow-700'
                    : 'text-gray-700 hover:text-yellow-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Contact Button */}
            <Link
              href="tel:+507-6273-5027"
              className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition-colors duration-200 font-medium"
            >
                              +507 6617-7498
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-yellow-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                                          ? 'text-yellow-700 bg-yellow-50'
                    : 'text-gray-700 hover:text-yellow-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="tel:+507-6273-5027"
                className="bg-yellow-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-800 transition-colors duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Llamar: +507 6617-7498
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header