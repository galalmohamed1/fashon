"use client";
import { GMLogo } from "@/components/ui/GMLogo";
import { AlertCircle, ArrowRight, Lock, Sparkles, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { verifyResetCode } from "@/actions/auth.actions";
import { forgotPasswords } from "@/actions/auth.actions";

const OTP_LENGTH = 6;

export default function OtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tick countdown for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    const email = sessionStorage.getItem("reset_email") || "";
    if (!email) {
      toast.error("Session expired. Please start over.");
      router.push("/forget-password");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await verifyResetCode(email, { otp });

    if (result?.ok) {
      toast.success("Code verified! Set your new password.");
      router.push("/forget-password/new-password");
    } else {
      const msg = result?.error || "Invalid code. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  async function handleResend() {
    const email = sessionStorage.getItem("reset_email") || "";
    if (!email) {
      toast.error("Session expired. Please start over.");
      router.push("/forget-password");
      return;
    }
    setResending(true);
    const result = await forgotPasswords({ email });
    setResending(false);
    if (result?.ok) {
      toast.success("A new code has been sent to your email.");
      setCountdown(60);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } else {
      toast.error(result?.error || "Failed to resend code.");
    }
  }

  return (
    <section>
      <div className="container py-16 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

          {/* Left Side — OTP Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <GMLogo size="sm" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Enter Reset Code
                </h1>
                <p className="text-gray-600 text-sm font-mono uppercase tracking-wider">
                  Check your inbox for a 6-digit code
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

              {/* OTP Form */}
              <form onSubmit={onSubmit} className="space-y-6">

                {/* OTP Digit Inputs */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold text-center">
                    Verification Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        id={`otp-digit-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        className="w-11 h-14 sm:w-13 sm:h-16 text-center text-xl font-bold rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all caret-transparent"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-xs text-gray-500 font-mono">
                      Resend code in{" "}
                      <span className="font-bold text-gray-700">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      id="otp-resend-btn"
                      onClick={handleResend}
                      disabled={resending}
                      className="text-xs text-green-600 hover:text-green-700 font-medium cursor-pointer flex items-center gap-1 mx-auto disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {resending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="otp-submit-btn"
                  disabled={loading || digits.join("").length < OTP_LENGTH}
                  className="btn bg-black text-white hover:bg-gray-800 py-3 w-full transition-colors cursor-pointer text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Wrong email?{" "}
                  <Link
                    href="/forget-password"
                    className="text-black font-bold uppercase tracking-wider hover:underline ml-1 cursor-pointer"
                  >
                    Go Back
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
                  One-Time Code
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
