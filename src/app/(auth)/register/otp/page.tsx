'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OtpVerificationPage from '@/components/features/auth/register-otp/otpVerification';
import { verifyResetCode } from '@/actions/auth.actions';


export default async function VerifyEmailWrapper({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const router = useRouter();

  const { email } = await searchParams;
  async function handleVerify(code: string) {
    const result = await verifyResetCode(email, {otp:code});
    if (!result.ok) {
      throw new Error(result.error); 
    }
    router.push('/login');
  }

  async function handleResend() {
    throw new Error('Resend not connected yet');
  }

  return (
    <OtpVerificationPage
      email={email ?? ''}
      onVerify={handleVerify}
      onResend={handleResend}
      onBackToSignIn={() => router.push('/login')}
    />
  );
}