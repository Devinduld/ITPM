"use client"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { Mail, Lock, AlertCircle, LogIn, Sun, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from '@/hooks/use-toast'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Cookies from 'js-cookie'

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")
  const { user, status, signIn, error: authError } = useAuth()
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  const callbackUrl = searchParams?.get("callbackUrl")
  const shouldShowCallback = callbackUrl && callbackUrl !== "/dashboard"
  
  useEffect(() => {
    const registered = searchParams?.get("registered")
    const resetSuccess = searchParams?.get("reset")
    const errorParam = searchParams?.get("error")
    
    if (registered === "true") {
      setSuccess("Registration successful! Please sign in with your credentials.")
    }
    
    if (resetSuccess === "true") {
      setSuccess("Your password has been reset successfully! Please sign in with your new password.")
    }
    
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin" 
          ? "Invalid email or password" 
          : "An error occurred during sign in"
      )
    }
  }, [searchParams])
  
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])
  
  useEffect(() => {
    if (status === "authenticated") {
      if (shouldShowCallback) {
        router.push(callbackUrl!)
      } else if (user?.role === "admin") {
        router.push("/admin")
      } else if (user?.role === "manager") {
        router.push("/manager")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, router, callbackUrl, shouldShowCallback, user])

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")
    
    try {
      console.log("Attempting to sign in with:", values.email)
      const user = await signIn(values.email, values.password)
      
      console.log("Sign-in successful, checking for redirection")
      successt({
        title: "Sign-in successful!",
        description: "You have successfully signed in.",
      })
      const redirectTimer = setTimeout(() => {
        console.log("Fallback redirection triggered")
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
        const role = storedUser?.role || 'user'
        
        if (role === 'admin') {
          window.location.href = '/admin'
        } else if (role === 'manager') {
          window.location.href = '/manager'
        } else {
          window.location.href = '/dashboard'
        }
      }, 1000)
      
      return () => clearTimeout(redirectTimer)
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message || "Failed to sign in. Please check your credentials.")
      errort({
        title: "Sign-in failed!",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50/50 to-blue-50/50 dark:from-yellow-900/10 dark:to-blue-900/10 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 blur-xl z-0" />
        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-blue-400/20 dark:bg-blue-400/10 blur-xl z-0" />
        
        <Card className="border-2 border-yellow-500/20 shadow-lg backdrop-blur-sm relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-600/10 blur-xl z-0" />
          
          <CardHeader className="space-y-2 pb-6 relative z-10">
            <div className="mx-auto mb-2 p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <Sun className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-center text-yellow-700 dark:text-yellow-400">
                Welcome Back
              </CardTitle>
            </motion.div>
            <CardDescription className="text-center text-lg">
              Sign in to access your Power Solar account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 relative z-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-green-300 bg-green-50 dark:bg-green-900/20">
                  <AlertDescription className="text-green-700 dark:text-green-400">{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400 text-base">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70 transition-colors group-hover:text-yellow-600" />
                            <Input 
                              placeholder="name@example.com" 
                              className="pl-10 h-12 transition-all duration-200 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading || status === "loading"} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400 text-base">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70 transition-colors group-hover:text-yellow-600" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10 h-12 transition-all duration-200 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading || status === "loading"} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md"
                    disabled={isLoading || status === "loading"}
                  >
                    {isLoading || status === "loading" ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center group">
                        <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                        Access My Solar Account
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-yellow-500/10 pt-4 pb-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-base text-yellow-700 dark:text-yellow-400">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline">
                  Join Power Solar
                </Link>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Harness the power of the sun with your account
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="container min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="rounded-full bg-yellow-200 dark:bg-yellow-800/20 h-16 w-16"></div>
          <div className="h-4 bg-yellow-200 dark:bg-yellow-800/20 rounded w-24"></div>
          <div className="h-2 bg-yellow-100 dark:bg-yellow-900/10 rounded w-16"></div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
