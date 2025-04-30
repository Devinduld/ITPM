'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Settings, LogOut, Menu, X, Search, AlertTriangle, Info, Check, TrendingDown, Sun, Zap, Sparkles } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { ThemeSwitch } from '../ThemeSwitch'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { adminSignOut } = useAuth() // Use the auth context

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      await adminSignOut();
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as read
  const markAsRead = async (ids: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!res.ok) throw new Error('Failed to update notifications');
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          ids.includes(notification._id) 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-yellow-500/20 transition-all duration-300">
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-800/10 dark:to-orange-800/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2">
              <Link href="/admin" className="flex items-center gap-2 text-xl font-bold transition-colors hover:text-yellow-600 group">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Sun className="h-5 w-5 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400">
                  Administrator Portal
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    className="relative p-2 rounded-full hover:bg-yellow-500/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-white dark:bg-gray-800 border border-yellow-500/20 p-4 rounded-xl mt-2 shadow-lg max-h-[70vh] overflow-auto">
                  <DropdownMenuLabel className="flex justify-between items-center text-yellow-700 dark:text-yellow-400">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <motion.button 
                        onClick={() => markAsRead(notifications.filter(n => !n.read).map(n => n._id))}
                        className="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Mark all as read
                      </motion.button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-yellow-500/20" />
                  
                  {loading ? (
                    <div className="py-4 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Sun className="w-5 h-5 text-yellow-500/70" />
                        </motion.div>
                        <span>Loading notifications...</span>
                      </div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`my-2 p-3 rounded-lg text-sm ${
                            notification.read 
                              ? 'bg-gray-50/80 dark:bg-gray-700/50' 
                              : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-yellow-700 dark:text-yellow-400">{notification.title}</div>
                              <p className="text-muted-foreground text-xs mt-1">
                                {notification.description}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                                {!notification.read && (
                                  <motion.button 
                                    onClick={() => markAsRead([notification._id])}
                                    className="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    Mark as read
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  
                  <DropdownMenuSeparator className="mt-2 bg-yellow-500/20" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors mt-2 justify-center p-0">
                    <Link href="/admin/notifications" className="w-full text-center text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm py-2 px-4 flex items-center justify-center gap-1">
                      View all notifications
                      <Zap className="w-3 h-3 ml-1" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    className="p-2 rounded-full hover:bg-yellow-500/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-yellow-500/20 p-4 rounded-xl mt-2 shadow-lg">
                  <DropdownMenuLabel className="text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Admin Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-yellow-500/20" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors my-1 px-2 py-1.5 text-gray-700 dark:text-gray-300">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors my-1 px-2 py-1.5 text-gray-700 dark:text-gray-300">Preferences</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors my-1 px-2 py-1.5 text-gray-700 dark:text-gray-300">Security</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Switch */}
              <div className="px-1">
                <ThemeSwitch />
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-900/20 dark:to-orange-900/20 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                    <span className="font-semibold">AS</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400 hidden sm:inline">
                    Admin
                  </span>
                </motion.div>
                <motion.button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <motion.button 
                className="relative p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              <div className="px-1">
                <ThemeSwitch />
              </div>
              <motion.button 
                className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                ) : (
                  <Menu className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="md:hidden py-4 space-y-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600/70 dark:text-yellow-500/70" />
                  <input 
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="bg-white/80 dark:bg-gray-800/80 border border-yellow-500/20 p-3 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.button 
                          className="relative p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Bell className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                          {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                              {unreadCount}
                            </span>
                          )}
                        </motion.button>
                        <motion.button 
                          className="p-2 hover:bg-yellow-500/10 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Settings className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-sm">
                          <span className="font-semibold">AS</span>
                        </div>
                        <motion.button 
                          onClick={handleLogout} 
                          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile notifications */}
                  <div className="space-y-2 mt-2">
                    <h3 className="font-medium px-2 text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Recent Notifications
                    </h3>
                    {notifications.length === 0 ? (
                      <div className="py-4 text-center text-muted-foreground bg-white/80 dark:bg-gray-800/80 rounded-lg border border-yellow-500/20 shadow-sm">
                        No notifications yet
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.slice(0, 3).map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-3 rounded-lg text-sm shadow-sm ${
                              notification.read 
                                ? 'bg-white/80 dark:bg-gray-800/80 border border-yellow-500/10' 
                                : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 border-t border-r border-b border-yellow-500/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-yellow-700 dark:text-yellow-400">{notification.title}</div>
                                <p className="text-muted-foreground text-xs mt-1">
                                  {notification.description}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Link 
                          href="/admin/notifications" 
                          className="block text-center text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-yellow-500/20 shadow-sm"
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
