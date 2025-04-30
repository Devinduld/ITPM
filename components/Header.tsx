"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from './ThemeSwitch'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { FiHome, FiInfo, FiSun, FiZap, FiBox, FiPhoneCall, FiUser, FiLogOut, FiChevronDown, FiSettings, FiUserPlus } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, status, signOut } = useAuth()
  const { successt, errort, warningt, infot, dismissAll } = useToast()
  
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20)
    })
    return () => unsubscribe()
  }, [scrollY])
  
  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Close menus when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      console.log("Attempting to sign out...");
      await signOut();
      console.log("Sign out successful");
      successt({
        title: "Sign out successful!",
        description: "You have successfully signed out.",
      })
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
      errort({
        title: "Sign out failed!",
        description: "Please try again later.",
      })
    }
  }

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-footer backdrop-blur-md shadow-sm h-14'
          : 'bg-gradient-to-r from-blue-500/90 to-green-600/90 backdrop-blur-sm h-18'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <span className={`font-extrabold text-xl ${isScrolled ? 'text-blue-600' : 'text-white'} hidden sm:inline`}>
                Power Solar
              </span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex rounded-lg p-1 items-center space-x-1">
            {[
              { href: '/', icon: FiHome, label: 'Home' },
              { href: '/about', icon: FiInfo, label: 'About Us' },
              { href: '/services', icon: FiSun, label: 'Services' },
              { href: '/projects', icon: FiZap, label: 'Projects' },
              { href: '/products', icon: FiBox, label: 'Products' },
              { href: '/contact', icon: FiPhoneCall, label: 'Contact' },
            ].map(({ href, icon: Icon, label }, index) => (
              <div key={href} className="flex items-center">
                <Link 
                  href={href} 
                  className={`flex items-center space-x-1 transition-colors group px-3 py-2 rounded-full ${
                    pathname === href
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold'
                      : `${isScrolled ? 'text-foreground hover:text-blue-600' : 'text-white hover:text-blue-200'} hover:bg-white/10`
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform" />
                  <span className="text-sm">{label}</span>
                </Link>
                {index < 5 && (
                  <span className={`mx-1 text-sm ${isScrolled ? 'text-gray-300' : 'text-blue-100/50'} hidden xl:inline`}>•</span>
                )}
              </div>
            ))}
          </nav>          
          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Auth Buttons or User Menu */}
            {status === "authenticated" && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                    isScrolled 
                      ? 'hover:bg-blue-50 text-foreground' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="font-medium text-sm hidden sm:inline-block">
                    {user.name || user.email}
                  </span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-border bg-gradient-to-r from-blue-500/10 to-orange-500/10">
                        <p className="font-medium text-sm">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                          >
                            <FiSettings className="w-4 h-4 mr-2 text-blue-600" />
                            Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'manager' && (
                          <Link
                            href="/manager"
                            className="flex items-center px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                          >
                            <FiSettings className="w-4 h-4 mr-2 text-blue-600" />
                            Manager Dashboard
                          </Link>
                        )}
                        {user.role === 'user' && (
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm  dark:hover:bg-blue-950/20 transition-colors"
                          >
                            <FiSettings className="w-4 h-4 mr-2 text-blue-600" />
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : status !== "loading" && (
              <div className="hidden md:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/signin" 
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isScrolled 
                        ? 'text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white' 
                        : 'text-white border border-white hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/signup" 
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isScrolled 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
            
            {/* Theme Switch */}
            <ThemeSwitch />

            {/* Mobile Menu Button */}
            <motion.button 
              className={`md:hidden p-1 rounded-lg ${
                isScrolled ? 'text-foreground hover:bg-blue-50' : 'text-white hover:bg-white/10'
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden bg-background/95 backdrop-blur-md border-t border-blue-100/20 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-3 py-2 space-y-1">
          {[
            { href: '/', icon: FiHome, label: 'Home' },
            { href: '/about', icon: FiInfo, label: 'About Us' },
            { href: '/services', icon: FiSun, label: 'Services' },
            { href: '/projects', icon: FiZap, label: 'Projects' },
            { href: '/products', icon: FiBox, label: 'Products' },
            { href: '/contact', icon: FiPhoneCall, label: 'Contact' },
          ].map(({ href, icon: Icon, label }) => (
            <Link 
              key={href}
              href={href} 
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                pathname === href
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
          
          {/* Mobile Auth Links */}
          {status === "authenticated" && user ? (
            <>
              <div className="pt-2 pb-1 border-t border-blue-100/30 mt-2">
                <p className="px-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">Account</p>
              </div>
              <Link 
                href="/profile" 
                className="flex items-center space-x-2 p-2 rounded-lg transition-all text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600"
              >
                <FiUser className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Profile</span>
              </Link>
              
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 p-2 rounded-lg transition-all text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600"
                >
                  <FiSettings className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              )}
              
              {user.role === 'manager' && (
                <Link 
                  href="/manager" 
                  className="flex items-center space-x-2 p-2 rounded-lg transition-all text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600"
                >
                  <FiSettings className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Manager Dashboard</span>
                </Link>
              )}
              
              {user.role === 'user' && (
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 p-2 rounded-lg transition-all text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600"
                >
                  <FiSettings className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}
              
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full space-x-2 p-2 rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </>
          ) : status !== "loading" && (
            <>
              <div className="pt-2 pb-1 border-t border-blue-100/30 mt-2">
                <p className="px-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">Account</p>
              </div>
              <Link 
                href="/signin" 
                className="flex items-center space-x-2 p-2 rounded-lg transition-all text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600"
              >
                <FiUser className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Sign In</span>
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center space-x-2 p-2 rounded-lg transition-all text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600"
              >
                <FiUserPlus className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.header>
  )
}
