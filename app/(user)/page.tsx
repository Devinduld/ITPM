'use client'
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin, Sun, Battery, House, Zap, Sparkles } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useTheme } from '@/providers/ThemeProvider'
import Link from "next/link"
import router from "next/router";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 }
}

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.5
    }
  }
}

const services = [
  {
    title: "Residential Solar Solutions",
    description: "Custom-designed solar systems for homes, helping families reduce energy costs and embrace clean power.",
    icon: <Sun className="w-6 h-6 text-primary" />
  },
  {
    title: "Commercial Solar Systems",
    description: "Scalable solar solutions for businesses, warehouses, and industrial facilities to maximize ROI.",
    icon: <Battery className="w-6 h-6 text-primary" />
  },
  {
    title: "Energy Efficiency Consulting",
    description: "Expert analysis and recommendations to optimize your property's energy consumption patterns.",
    icon: <House className="w-6 h-6 text-primary" />
  }
]

export default function Home() {
  const { theme } = useTheme()

  return <>
  {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-green-600"
      >
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              className="space-y-4 md:space-y-6 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
                Harness the Sun with <span className="text-yellow-400">Power Solar</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0">
                Your trusted partner in renewable energy solutions. We deliver innovative solar technology to power homes and businesses sustainably.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button className="btn btn-primary bg-yellow-400 text-blue-900 hover:bg-yellow-500 w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center gap-2 font-bold">
                  Free Consultation <ArrowRight className="w-5 h-5" />
                </button>
                <Link href='/calculator'>
                  <motion.button
                    className="relative btn overflow-hidden text-white w-full sm:w-auto px-6 py-3 rounded-full flex items-center justify-center gap-2 
                      border border-white bg-transparent hover:bg-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Solar Savings Calculator
                    <Zap className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      variants={staggerContainer}
      id="services" 
      className="py-12 bg-background"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl font-bold text-center mb-12"
        >
          Our Solar Solutions
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 }
              }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary transition-colors"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      className="py-16 bg-card"
    >
      <motion.div 
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.5 } }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Benefits of Going Solar</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Sustainable Future</h3>
            <p>Join the renewable energy revolution and help create a cleaner planet for future generations.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Financial Benefits</h3>
            <p>Substantial savings on energy bills with potential ROI within 5-7 years.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      className="py-16 bg-background"
    >
      <motion.div 
        variants={{
          initial: { opacity: 0, y: 100 },
          animate: { opacity: 1, y: 0 }
        }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Advanced Solar Technology</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Premium Solar Panels</h3>
            <p>High-efficiency panels with 25+ years warranty coverage.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Intelligent Monitoring</h3>
            <p>24/7 performance tracking with our advanced monitoring platform.</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Energy Storage</h3>
            <p>State-of-the-art battery systems for continuous power supply.</p>
          </div>
        </div>
      </motion.div>
    </motion.section>

    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.8 } }
      }}
      id="contact" 
      className="bg-card py-12"
    >
      <motion.div
        variants={staggerContainer}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Get In Touch</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>1-888-POWER-SOLAR</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>info@powersolar.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>456 Energy Avenue, Solar City, SC 12345</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <FaFacebook className="w-6 h-6 hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="w-6 h-6 hover:text-pink-600 cursor-pointer" />
            <FaTwitter className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <FaLinkedin className="w-6 h-6 hover:text-blue-700 cursor-pointer" />
          </div>
        </div>
      </motion.div>
    </motion.section>
  </>
}
