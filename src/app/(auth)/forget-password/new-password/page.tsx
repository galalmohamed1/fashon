"use client";
import { GMLogo } from "@/components/ui/GMLogo";
import { AlertCircle, ArrowRight, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { IoLockClosed } from "react-icons/io5";
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/schemas/auth.schema";
import { resetPassword } from "@/actions/auth.actions";

export default function NewPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "", newPassword: "", rePassword: "" },
  });

  async function onSubmit(data: ResetPasswordSchemaType) {
    // Prefer the stored email, fall back to what user types in the hidden field
    const storedEmail = sessionStorage.getItem("reset_email") || "";
    const payload: ResetPasswordSchemaType = {
      ...data,
      email: storedEmail || data.email,
    };

    setLoading(true);
    setErrorMessage(null);

    const result = await resetPassword(payload);

    if (result?.ok) {
      toast.success("Password reset successfully! Please sign in.");
      sessionStorage.removeItem("reset_email");
      router.push("/login");
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

          {/* Left Side — New Password Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <GMLogo size="sm" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Set New Password
                </h1>
                <p className="text-gray-600 text-sm font-mono uppercase tracking-wider">
                  Choose a strong password for your account
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

                {/* New Password Field */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold"
                    htmlFor="np-newPassword"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl cursor-pointer text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                      aria-label="Toggle new password visibility"
                    >
                      {showNew ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <input
                      {...register("newPassword")}
                      id="np-newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-500 font-mono">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold"
                    htmlFor="np-rePassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl cursor-pointer text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <input
                      {...register("rePassword")}
                      id="np-rePassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                    />
                  </div>
                  {errors.rePassword && (
                    <p className="text-xs text-red-500 font-mono">
                      {errors.rePassword.message}
                    </p>
                  )}
                </div>

                {/* Password hint */}
                <p className="text-[11px] text-gray-400 font-mono">
                  Must be 8–16 characters and include a letter, number, and special character.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="np-submit-btn"
                  disabled={loading}
                  className="btn bg-black text-white hover:bg-gray-800 py-3 w-full transition-colors cursor-pointer text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
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
                  Encrypted
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
