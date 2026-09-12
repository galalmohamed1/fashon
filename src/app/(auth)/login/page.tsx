"use client";
import { GMLogo } from '@/components/ui/GMLogo';
import { AlertCircle, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";
import { useContext, useState } from 'react';
import { WishlistContext } from '@/lib/context/WishlistContext';
import { LoginSchema, LoginSchemaType } from '@/schemas/auth.schema';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Field,FieldError, FieldLabel } from '@/components/ui/field';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { IoLockClosed } from "react-icons/io5";

function page() {
  const router = useRouter();
  const { update } = useSession();
  const wishlistContext = useContext(WishlistContext);
  const refreshWishlist = wishlistContext?.refreshWishlist;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });
  const { handleSubmit, register, formState: { errors } } = form;

  async function mySubmit(data: LoginSchemaType) {
    setLoading(true);
    const response = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: "/",
    });
    if (response?.ok) {
      await update();

      if (refreshWishlist) {
        await refreshWishlist();
      }

      toast.success(
        "Hey! Good to see you. Welcome back! You are now logged in ❤️💕"
      );

      router.replace("/");
      router.refresh();
    } else {
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast.error(response?.error);
    }
    setLoading(false);
  }
  return (
    <>
      <section>
        <div className="container py-16 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Side - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <GMLogo size="sm" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Sign In
                  </h1>
                  <p className="text-gray-600 text-sm font-mono uppercase tracking-wider">
                    Access Your Archival Wardrobe
                  </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs font-mono"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* //Social Logins
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3 0-.9.1-1.7.4-2.3L1.9 7.2C.7 9.6 0 12.2 0 15c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current text-blue-600" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.65-.79 1.09-1.89.97-2.99-1 .04-2.15.65-2.82 1.44-.58.67-1.1 1.77-.96 2.84 1.11.09 2.16-.54 2.81-1.29z" />
                    </svg>
                    <span className="font-medium text-gray-700">Continue with Apple</span>
                  </button>
                </div> */}

                {/* Divider */}
                {/* <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-mono uppercase tracking-wider text-[10px] font-medium">
                      OR CONTINUE WITH EMAIL
                    </span>
                  </div>
                </div> */}

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit(mySubmit)} className="space-y-4">
                  
                  {/* Email Field */}
                  <div className="relative flex flex-col gap-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 font-mono">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <IoLockClosed className="absolute left-4 top-9.5 text-xl text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-9.5 text-xl cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <Controller
                          name="password"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <div className="flex items-center justify-between">
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                
                              </div>
                              <Input
                                {...field}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your password"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                              />
                              <div className="flex items-center justify-between">
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                              <Link
                                  className="text-sm text-green-600 hover:text-green-700 cursor-pointer font-medium ml-auto"
                                  href="/forget-password"
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                            </Field>
                            
                          )}
                        />
                    {errors.password && (
                      <p className="text-xs text-red-500 font-mono">{errors.password.message}</p>
                    )}
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
                      Keep me signed in
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn bg-black text-white hover:bg-gray-800 py-3 w-full transition-colors cursor-pointer text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl mt-6"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer - Create Account */}
                <div className="text-center mt-8 pt-6 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link
                      type="button"
                      href="/register"
                      className="text-black font-bold uppercase tracking-wider hover:underline ml-1 cursor-pointer"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center space-x-6 mt-6 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Secure Client Access
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Exclusive Access
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Verified Atelier
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Editorial Image & Info */}
            <div className="hidden lg:block">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    GM Atelier - Avant-Garde Streetwear
                  </h2>
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                  alt="GM Atelier Runway Editorial"
                  className="w-full h-[400px] object-cover rounded-2xl shadow-lg filter grayscale contrast-110 brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    
                  </h2>
                  <p className="text-lg text-gray-600">
                    Join our exclusive clientele and access private archival drops, bespoke sizing, and priority international dispatch
                  </p>
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2 text-black" /> Private Access
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-black" /> Secure Payment
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-black" /> 24/7 Support
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>

  )
}

export default page