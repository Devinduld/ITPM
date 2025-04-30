"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { Mail, Lock, User, Phone, MapPin, AlertCircle, UserPlus, Sun, Zap } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { districts } from "@/lib/districts"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  district: z.string().min(1, { message: "Please select your district" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { status } = useAuth()
  const { successt, errort, warningt, infot, dismissAll } = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      district: "",
      address: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          district: values.district,
          address: values.address,
          password: values.password,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to register")
      }
      
      successt({
        title: "Sign-up successful!",
        description: "You have successfully registered. You can now sign in.",
      })
      // Redirect to sign in page with success message
      router.push("/signin?registered=true")
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Failed to register. Please try again.")
      errort({
        title: "Sign-up failed!",
        description: "Please check your information and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-yellow-50/50 to-blue-50/50 dark:from-yellow-900/10 dark:to-blue-900/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 blur-xl z-0" />
        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-blue-400/20 dark:bg-blue-400/10 blur-xl z-0" />
        
        <Card className="border-2 border-yellow-500/20 shadow-lg backdrop-blur-sm relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 dark:from-yellow-500/10 dark:to-orange-600/10 blur-xl z-0" />
          
          <CardHeader className="space-y-1 pb-6 relative z-10">
            <div className="mx-auto mb-2 p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <Sun className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-yellow-700 dark:text-yellow-400">Join Power Solar</CardTitle>
            <CardDescription className="text-center max-w-md mx-auto">
              Create your account to access clean energy solutions and manage your solar power journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 relative z-10">
            {error && (
              <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70" />
                            <Input 
                              placeholder="name@example.com" 
                              className="pl-10 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70" />
                            <Input 
                              placeholder="07XXXXXXXX" 
                              className="pl-10 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">District</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="pl-10 border-yellow-500/30 focus:ring-yellow-500/50 shadow-sm">
                              <SelectValue placeholder="Select your district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-yellow-500/30 pt-20 min-h-52">
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70" />
                            <Input 
                              placeholder="Your full address" 
                              className="pl-10 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-700 dark:text-yellow-400">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-600/70 dark:text-yellow-500/70" />
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="pl-10 border-yellow-500/30 focus:border-yellow-500 focus-visible:ring-yellow-500/50 shadow-sm" 
                              disabled={isLoading} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-yellow-500/20 p-4  shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600 border-yellow-500/50"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          I agree to the{" "}
                          <Link href="/terms" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline">
                            terms of service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline">
                            privacy policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md py-6 group" 
                  disabled={isLoading || status === "loading"}
                >
                  {isLoading || status === "loading" ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your solar account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center group">
                      <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                      Start Your Solar Journey
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-yellow-500/10 pt-4 pb-6 relative z-10">
            <div className="text-center">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Already have an account?{" "}
                <Link href="/signin" className="font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:underline">
                  Sign in to Power Solar
                </Link>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Join us in the renewable energy revolution
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
