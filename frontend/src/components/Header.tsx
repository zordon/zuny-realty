'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Dictionary } from '@/lib/dictionaries'

interface HeaderProps {
  dict: Dictionary;
  lang: 'en' | 'es';
}

const Header: React.FC<HeaderProps> = ({ dict, lang }) => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Remove current locale from pathname for comparison
  const currentPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
  const isActive = (path: string) => {
    const normalizedPath = path === '/' ? '/' : path
    return currentPath === normalizedPath || (currentPath === '/' && path === '/')
  }

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/properties`, label: dict.nav.properties },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ]

  const LanguageSwitcher = () => (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <Link
        href={pathname.replace(/^\/[a-z]{2}(\/|$)/, '/es$1')}
        className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
          lang === 'es'
            ? 'bg-yellow-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        ES
      </Link>
      <Link
        href={pathname.replace(/^\/[a-z]{2}(\/|$)/, '/en$1')}
        className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
          lang === 'en'
            ? 'bg-yellow-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        EN
      </Link>
    </div>
  )

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-3">
            <div className="h-20 w-auto overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="ZuR Real Estate" 
                width={180}
                height={90}
                className="h-24 w-auto object-contain scale-150 transform-gpu -translate-y-2 relative top-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 hidden sm:block">{dict.header.tagline}</span>
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
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
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
{dict.header.call} +507 6617-7498
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header