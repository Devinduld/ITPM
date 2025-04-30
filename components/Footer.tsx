'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight, FaSun, FaBolt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 relative">
      <div className="absolute inset-0 bg-[url('/solar-pattern.png')] opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div className="space-y-6">
            <Link href="/" className="block transform hover:scale-105 transition-transform duration-300">
              <div className="relative w-[120px] h-[48px] md:w-[140px] md:h-[56px]">
                <Image 
                  src="/power-solar-logo.png" 
                  alt="Power Solar" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-lg leading-relaxed text-gray-300 hover:text-gray-200 transition-colors">
              Empowering homes and businesses with clean, renewable solar energy solutions. Your trusted partner in the journey towards a sustainable future.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-primary font-semibold">Trusted by</span>
              <div className="text-primary">
                <span>10,000+ customers</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative inline-block">
              Solar Solutions
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {[
                { href: '/residential', text: 'Residential Solar', icon: '🏠' },
                { href: '/commercial', text: 'Commercial Solar', icon: '🏢' },
                { href: '/battery', text: 'Solar Battery Storage', icon: '🔋' },
                { href: '/maintenance', text: 'Solar Maintenance', icon: '🔧' },
                { href: '/financing', text: 'Solar Financing', icon: '💰' },
                { href: '/savings', text: 'Energy Savings', icon: '📊' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center space-x-2 text-gray-300 hover:text-primary transition-all duration-300">
                    <span>{link.icon}</span>
                    <span>{link.text}</span>
                    <FaBolt className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative inline-block">
              Connect With Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-4">
              <a href="tel:8001234567" className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-primary/20 transition-all duration-300">
                <div className="bg-primary rounded-full p-2">
                  <FaPhoneAlt className="text-slate-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Call Our Experts</p>
                  <p className="text-white">(800) 123-4567</p>
                </div>
              </a>
              <a href="mailto:hello@powersolar.com" className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-primary/20 transition-all duration-300">
                <div className="bg-primary rounded-full p-2">
                  <FaEnvelope className="text-slate-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Us</p>
                  <p className="text-white">hello@powersolar.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-primary/20 transition-all duration-300">
                <div className="bg-primary rounded-full p-2">
                  <FaMapMarkerAlt className="text-slate-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Headquarters</p>
                  <p className="text-white">456 Power Avenue, Solar City, PC 67890</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div className="space-y-6">
            <h4 className="text-xl font-bold text-white relative inline-block">
              Stay Powered Up
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <p className="text-gray-300">Subscribe for solar tips, industry updates, and exclusive offers.</p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSun className="text-primary" />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-slate-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                Power Up My Inbox
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Links & Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-slate-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex space-x-6">
              {[
                { Icon: FaFacebookF, href: '#', color: '#FFD700' },
                { Icon: FaTwitter, href: '#', color: '#FFD700' },
                { Icon: FaInstagram, href: '#', color: '#FFD700' },
                { Icon: FaLinkedinIn, href: '#', color: '#FFD700' }
              ].map(({ Icon, href, color }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className="bg-slate-800/50 p-3 rounded-full hover:bg-primary/20 transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="text-xl" style={{ color }} />
                </Link>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Power Solar. Illuminating futures, sustainably.
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
                <span className="text-gray-400">•</span>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
