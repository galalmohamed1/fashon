'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react';
import { motion } from 'motion/react';
import { Zap, CheckCheck, RefreshCw, Star, Truck, ShieldCheck } from 'lucide-react';
import { GMLogo } from '@/components/ui/GMLogo';
import { RegisterSchemaType } from '@/schemas/auth.schema';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

interface OtpVerificationPageProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBackToSignIn: () => void;
}

export default function OtpVerificationPage({
  email,
  onVerify,
  onResend,
  onBackToSignIn,
}: OtpVerificationPageProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const isExpired = secondsLeft <= 0;
  const isComplete = otp.every((digit) => digit !== '');

  // Countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Focus first box on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    const digit = value[value.length - 1];
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setError(null);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    setError(null);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  async function handleSubmit() {
    if (!isComplete || isExpired || isVerifying) return;
    setIsVerifying(true);
    setError(null);
    try {
      await onVerify(otp.join(''));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid passcode. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await onResend();
      setOtp(Array(OTP_LENGTH).fill(''));
      setSecondsLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend code. Try again.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <section className="py-10 text-zinc-600 bg-zinc-50/60 ">
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
      
        {/* ============ العمود الشمال: الفورم ============ */}
        <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black border border-emerald-800/60 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                <span>CODE TRANSMITTED TO EMAIL</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-black">
                Enter 6-Digit Passcode
              </h2>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Dispatched to <strong className="text-black">{email}</strong>
              </p>
            </div>

            {/* OTP Boxes */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 py-3">
              {otp.map((digit, index) => {
                const filled = digit !== '';
                const showError = Boolean(error) && !filled;
                return (
                  <div key={index} className="relative flex-1">
                    <input
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      type="text"
                      value={digit}
                      disabled={isExpired || isVerifying}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-full h-14 sm:h-16 text-center font-mono font-bold text-xl sm:text-2xl rounded-2xl border-2 transition-all outline-none disabled:opacity-40 ${
                        showError
                          ? 'border-red-500 bg-black text-white shadow-lg ring-2 ring-red-500/20'
                          : filled
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-800 bg-black/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="text-xs font-mono text-red-400 -mt-3">{error}</p>
            )}

            <button
              type="button"
              disabled={!isComplete || isExpired || isVerifying}
              onClick={handleSubmit}
              className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-gray-800 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCheck className="w-4 h-4" aria-hidden="true" />
                  <span>AUTHENTICATE &amp; GRANT CLEARANCE</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                {isExpired ? (
                  <span className="text-red-400 font-bold">Passcode expired.</span>
                ) : (
                  <span>
                    Code expires in{' '}
                    <strong className="text-black">
                      {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
                      {String(secondsLeft % 60).padStart(2, '0')}
                    </strong>
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={isResending}
                onClick={handleResend}
                className="flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer text-black hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>{isResending ? 'Sending…' : 'Resend Code'}</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
          <span>Already possess an existing account?</span>
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-white font-bold uppercase tracking-wider hover:underline self-start sm:self-auto cursor-pointer"
          >
            Standard Sign In →
          </button>
        </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            alt="GM Atelier Runway Editorial"
            className="w-full h-[400px] object-cover rounded-2xl shadow-lg mb-6 filter grayscale contrast-110 brightness-90 hidden lg:block"
            referrerPolicy="no-referrer"
          />

          <GMLogo size="sm" />         
          <h1 className="text-3xl md:text-4xl font-bold text-black">
                    Welcome to 
                    <span className="text-black"> GMStore</span>
          </h1>
          <p className="text-xl mt-2 mb-4 text-zinc-600">
            Unlock bespoke 3D garment customization, limited archive releases,
            and express worldwide dispatch.
          </p>

        </div>
        
        </div>
    </section>
  );
}

