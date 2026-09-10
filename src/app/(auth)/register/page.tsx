'use client';

import { motion } from 'motion/react';
import {
  User,
  Mail,
  AlertCircle,
  Star,
  Truck,
  ShieldCheck,
  Chrome,
  Facebook,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RegisterSchema, RegisterSchemaType } from '@/schemas/auth.schema';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegister } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { SpinnerCustom } from '@/components/ButtonSpinner/ButtonSpinner';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa6';
import { IoLockClosed } from 'react-icons/io5';
import { GMLogo } from '@/components/ui/GMLogo';

export default function RegisterPage() {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function checkPasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }
  const strength = checkPasswordStrength(passwordValue);

  const strengthData = {
    0: {
      text: "Weak",
      color: "bg-gray-200",
      bgt: "text-gray-400",
      width: "0%",
    },
    1: { text: "Weak", color: "bg-red-500", bgt: "text-red-500", width: "20%" },
    2: {
      text: "Fair",
      color: "bg-orange-500",
      bgt: "text-orange-500",
      width: "40%",
    },
    3: {
      text: "Good",
      color: "bg-blue-500",
      bgt: "text-blue-500",
      width: "60%",
    },
    4: {
      text: "Strong",
      color: "bg-green-500",
      bgt: "text-green-500",
      width: "80%",
    },
    5: {
      text: "Strong",
      color: "bg-green-600",
      bgt: "text-green-600",
      width: "100%",
    },
  }[strength];

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      terms: false,
    },
    resolver: zodResolver(RegisterSchema),
  });

  const { register, handleSubmit } = form;

  async function mySubmit(data: RegisterSchemaType) {
    setLoading(true);
      const isAccountSuccess = await userRegister(data);
      if (isAccountSuccess) {
        toast.success('Welcome You’re all set! Your account has been created successfully ❤️💕');
              setTimeout(() => {
            router.push(`/register/otp?email=${encodeURIComponent(data.email)}`);
    }, 1500);
      } else {
              const msg = isAccountSuccess?.error ?? "An unexpected error occurred. Please try again.";
              setErrorMessage(msg);
              toast.error(msg);
      }
    setLoading(false);
  }

  return (
    <section className="py-10 text-zinc-600 bg-zinc-50/60 ">
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
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

  <ul className="*:flex *:items-start *:gap-4 space-y-6 my-8">
    <li>
      <div className="icon size-12 text-lg bg-black text-gray-200 rounded-full flex justify-center items-center">
        <Star className="w-5 h-5" />
      </div>
      <div className="content">
        <h2 className="text-lg font-semibold text-black">Premium Quality</h2>
        <p className="text-gray-600">
          Sculpted garments crafted from trusted ateliers.
        </p>
      </div>
    </li>
    <li>
      <div className="icon size-12 text-lg bg-black text-gray-200 rounded-full flex justify-center items-center">
        <Truck className="w-5 h-5" />
      </div>
      <div className="content">
        <h2 className="text-lg font-semibold text-black">Express Dispatch</h2>
        <p className="text-gray-600">
          Complimentary global express courier delivery.
        </p>
      </div>
    </li>
    <li>
      <div className="icon size-12 text-lg bg-black text-gray-200 rounded-full flex justify-center items-center">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="content">
        <h2 className="text-lg font-semibold text-black">Secure Membership</h2>
        <p className="text-gray-600">
          Your data and payments are completely secure.
        </p>
      </div>
    </li>
  </ul>

  <div className="review bg-white shadow-sm p-4 rounded-md">
    <div className="author flex items-center gap-4 mb-4">
      <div className="size-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-500">
        MJ
      </div>
      <div>
        <h3 className="font-semibold text-black">Marc J.</h3>
        <div className="rating *:text-yellow-400 flex gap-1">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
        </div>
      </div>
    </div>
    <p className="italic text-gray-600">
      &quot;Sculpted garments designed for timeless modern expression. The
      fit calibration is unmatched.&quot;
    </p>
  </div>
      </div>

        {/* ============ العمود اليمين: الفورم ============ */}
        <div className="bg-white rounded-2xl shadow-lg px-6 py-10">
          <h2 className="text-center text-3xl font-semibold mb-2 text-black">
            Create Your Account
          </h2>
          <p className="text-center text-zinc-500">
            VIP client membership — start your journey with us today
          </p>

          {/* Social login (اختياري - شكل بس) */}
          <div className="register-options flex gap-2 *:grow my-10">
            <button
              type="button"
              className="btn bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center px-4 py-2 rounded-md cursor-pointer transition-colors"
            >
              <Chrome className="w-4 h-4 me-2 text-red-500" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="btn bg-transparent border border-gray-300 hover:bg-gray-100 flex justify-center items-center px-4 py-2 rounded-md cursor-pointer transition-colors"
            >
              <Facebook className="w-4 h-4 me-2 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="divider relative w-full h-0.5 bg-gray-300/30 my-4 flex items-center before:content-['or'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white before:px-4 before:text-xs before:text-gray-400">
            <span className="sr-only">or</span>
          </div>

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

          <form className="space-y-7" onSubmit={handleSubmit(mySubmit)}>
              <div className="flex flex-col gap-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Name*</FieldLabel>
                      <div className='relative'>
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Galal"
                        autoComplete="off"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                      />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email*</FieldLabel>
                      <div className='relative'>
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <Input
                        {...field}
                        id="email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                        aria-invalid={fieldState.invalid}
                        placeholder="galal@example.com"
                        />
                        </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
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
                      <FieldLabel htmlFor="password">Password*</FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => {
                          field.onChange(e); // مهم جدًا عشان RHF
                          setPasswordValue(e.target.value); // نحفظ القيمة
                        }}
                        aria-invalid={fieldState.invalid}
                        placeholder="create a strong password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        {/* bar */}
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${strengthData?.color}`}
                            style={{ width: strengthData?.width }}
                          ></div>
                        </div>
                        {/* text */}
                        <div className="flex justify-between mt-1 text-sm">
                          <span className={`font-medium ${strengthData?.bgt}`}>
                            {strengthData?.text}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 -mt-2 text-xs">
                        Must be at least 8 characters with numbers and symbols
                      </p>
                    </Field>
                  )}
                />
                </div>
              </div>
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
                  name="rePassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="rePassword">
                        Confirm Password*
                      </FieldLabel>
                      <Input
                        {...field}
                        id="rePassword"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm your Password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                </div>
              </div>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Phone className="absolute left-4 top-9.5 text-xl text-gray-400" />
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phone">Phone Number*</FieldLabel>
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="+1 234 567 8900"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="size-4 accent-green-600"
                    {...register("terms")}
                  />
                  <label htmlFor="terms">
                    I agree to the{" "}
                    <Link
                      className="text-green-600 hover:underline"
                      href="/terms"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      className="text-green-600 hover:underline"
                      href="/privacy-policy"
                    >
                      Privacy Policy
                    </Link>{" "}
                    *
                  </label>
                </div>
                {form.formState.errors.terms && (
                  <span className="text-red-600 text-sm">
                    {form.formState.errors.terms.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="btn bg-black text-white hover:bg-gray-800 py-5 w-full transition-colors cursor-pointer text-[16px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed!"
            >
              
                {loading ? (
                  <>
                    <SpinnerCustom />
                    <span>Creating Account</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="me-1" />
                    <span>Create My Account</span>
                  </>
                )}
              </Button>
            </form>

          <p className="border-t pt-6 border-gray-300/30 mt-8 text-center text-sm">
            Already have an account?
            <Link
              type="button"
              href='/login'
              className="text-green-600 ms-2 cursor-pointer hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
        
        </div>
    </section>
  );
}