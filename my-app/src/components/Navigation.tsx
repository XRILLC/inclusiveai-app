"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (pathname === path) {
      return 'bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 bg-clip-text text-transparent';
    }
    return 'text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-sky-600 hover:bg-clip-text hover:text-transparent dark:hover:from-emerald-400 dark:hover:to-sky-400 transition-all';
  };

  const menuItems = [
    { href: '/', label: 'Map' },
    { href: '/directory', label: 'Directory' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/developers', label: 'Developers' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/90 via-sky-50/80 to-white/90 dark:from-gray-900/90 dark:via-sky-900/80 dark:to-gray-900/90 backdrop-blur-sm border-b border-sky-100/20 dark:border-sky-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Hamburger menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                <div className="w-6 h-6 flex flex-col justify-around">
                  <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block w-6 h-0.5 bg-current transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-600 dark:from-emerald-400 dark:via-sky-400 dark:to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              DigitalDivide.ai
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === item.href ? 'border-blue-500' : 'border-transparent'} ${isActive(item.href)}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg py-2`}>
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.href ? 'bg-blue-500/10 dark:bg-blue-400/10' : ''} ${isActive(item.href)}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

