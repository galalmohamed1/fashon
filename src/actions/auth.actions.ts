'use server';
// import { getAccessToken } from '@/utilities';
import {
  forgotPasswordSchemaType,
  OtpSchemaType,
  RegisterSchemaType,
  ResetPasswordSchemaType,
} from '@/schemas/auth.schema';
// userRegister
export async function userRegister(data: RegisterSchemaType) {
    try {
        const res = await fetch('https://backend-lamsa.vercel.app/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        })
      const result = await res.json();
      return {
        ok: res.ok,
        data: result,
        error: result?.message || null,
      };
    }catch{}
}
// forgotPasswords
export async function forgotPasswords(data: forgotPasswordSchemaType) {
  try {
    const res = await fetch('https://backend-lamsa.vercel.app/api/auth/forgotPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err) {
    return {
      ok: false,
      error: 'Something went wrong',
    };
  }
}
// resetPassword
export async function resetPassword(data: ResetPasswordSchemaType) {
  try {
    const res = await fetch('https://backend-lamsa.vercel.app/api/auth/resetPassword', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err) {
    return {
      ok: false,
      error: 'Something went wrong',
    };
  }
}
// verifyResetCode
export async function verifyResetCode(email: string,
  data: OtpSchemaType) {
  try {
    const res = await fetch(
      "https://backend-lamsa.vercel.app/api/auth/verify-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode: data.otp }),
      },
    );
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err) {
    return {
      ok: false,
      error: 'Something went wrong',
    };
  }
}
// changeMyPassword
// export async function changeMyPassword(data: UpdatePasswordSchemaType) {
//     const token = await getAccessToken();
//   try {
//     const res = await fetch('https://backend-lamsa.vercel.app/api/auth/changeMyPassword', {
//       method: 'PUT',
//       headers: {  token: token as string, 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         currentPassword:data.password,
//         password: data.newPassword,
//         rePassword:  data.rePassword,
//       }),
//     });
//     const result = await res.json();
//     return {
//       ok: res.ok,
//       data: result,
//       error: result?.message || null,
//     };
//   } catch (err) {
//     return {
//       ok: false,
//       error: 'Something went wrong',
//     };
//   }
// }