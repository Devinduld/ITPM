'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Package,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Sun,
  FileText,
  TrendingUp,
  AlertCircle,
  UserCog, 
  PenTool, 
  FileSpreadsheet, 
  Megaphone,
  LogOut,
  Coins,
  Bell,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

interface DashboardCard {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
}

interface AdminFeatureCard {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  color: string
}

export default function AdminDashboard() {
  const [notifications] = useState(5)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const adminFeatures: AdminFeatureCard[] = [
    {
      title: "Projects Management",
      description: "Manage projects",
      icon: <Package/>,
      link: "/admin/projects",
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Finance Management",
      description: "View and manage financial information",
      icon: <Coins/>,
      link: "/admin/finance",
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Employee Management",
      description: "Manage employees salary and performance",
      icon: <UserCog/>,
      link: "/admin/employee",
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Customer Database",
      description: "Store and manage customer information",
      icon: <FileText/>,
      link: "/admin/customers",
      color: "from-amber-400 to-yellow-500"
    },
    {
      title: "Notifications",
      description: "View and manage notifications",
      icon: <Bell className='animate-bounce'/>,
      link: "/admin/notifications",
      color: "from-red-400 to-rose-500"
    },
    {
      title: "Maintenance Tracking",
      description: "Monitor and schedule system maintenance",
      icon: <PenTool/>,
      link: "/admin/maintenance",
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Quote Generator",
      description: "Create and manage customer quotes",
      icon: <FileSpreadsheet/>,
      link: "/admin/quotes",
      color: "from-violet-400 to-purple-500"
    },
    {
      title: "Support Tickets",
      description: "Manage customer support requests",
      icon: <MessageSquare/>,
      link: "/admin/support",
      color: "from-pink-400 to-fuchsia-500"
    }
  ]

  const handleLogout = () => {
    alert('Logout clicked')
    window.location.href = '/login'
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-yellow-400/10 dark:bg-yellow-400/5 blur-2xl z-0" />
      <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-400/10 dark:bg-blue-400/5 blur-2xl z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex p-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-600/10 rounded-2xl mb-4">
            <Sun className="h-8 w-8 text-yellow-500 dark:text-yellow-400" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">Power Solar Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Manage your solar power business from one central location
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {adminFeatures.map((feature, index) => (
            <motion.div 
              key={index} 
              className="relative" 
              onMouseEnter={() => setHoveredCard(index)} 
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Link 
                href={feature.link}
                className="group h-full block"
              >
                <div className="bg-card border-2 border-yellow-500/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`bg-gradient-to-r ${feature.color} h-2`}></div>
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-lg text-yellow-700 dark:text-yellow-400 mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs font-medium inline-flex items-center text-yellow-600 dark:text-yellow-400 group-hover:underline">
                        Manage
                        <Zap className="ml-1 h-3 w-3 group-hover:animate-pulse" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {hoveredCard === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs z-20"
                >
                  <Zap className="h-3 w-3" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
