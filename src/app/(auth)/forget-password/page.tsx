"use client";
import { GMLogo } from "@/components/ui/GMLogo";
import { AlertCircle, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { forgotPasswordSchema, forgotPasswordSchemaType } from "@/schemas/auth.schema";
import { forgotPasswords } from "@/actions/auth.actions";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: forgotPasswordSchemaType) {
    setLoading(true);
    setErrorMessage(null);

    const result = await forgotPasswords(data);

    if (result?.ok) {
      toast.success("Reset code sent! Check your inbox.");
      // Store email in sessionStorage for the OTP step
      sessionStorage.setItem("reset_email", data.email);
      router.push("/forget-password/otp");
    } else {
      const msg = result?.error || "Something went wrong. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="container py-16 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

          {/* Left Side — Forgot Password Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <GMLogo size="sm" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 text-sm font-mono uppercase tracking-wider">
                  We'll send a reset code to your email
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

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold"
                    htmlFor="fp-email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      {...register("email")}
                      id="fp-email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-mono">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="fp-submit-btn"
                  disabled={loading}
                  className="btn bg-black text-white hover:bg-gray-800 py-3 w-full transition-colors cursor-pointer text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl mt-6"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Remembered your password?{" "}
                  <Link
                    href="/login"
                    className="text-black font-bold uppercase tracking-wider hover:underline ml-1 cursor-pointer"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-6 mt-6 text-xs md:text-sm text-gray-500">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Secure Reset
                </div>
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Instant Delivery
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Verified Atelier
                </div>
              </div>
            </div>
          </div>

          {/* Right Side — Editorial Image */}
          <div className="hidden lg:block">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                GM Atelier — Avant-Garde Streetwear
              </h2>
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                alt="GM Atelier Runway Editorial"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg filter grayscale contrast-110 brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  Join our exclusive clientele and access private archival drops,
                  bespoke sizing, and priority international dispatch
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
  );
}