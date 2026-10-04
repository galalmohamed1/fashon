import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(requset: NextRequest) {
  const protectedRoutes = [
    '/profile/address',
    '/profile/settings',
    '/checkout',
    '/cart',
    '/wishlist',
  ];
  const authRoutes = [
    '/login',
    '/register',
    '/forget-password',
    '/forget-password/otp',
    '/forget-password/new-password' ,
  ];
  const myPath = requset.nextUrl.pathname;
  const myToken = await getToken({
    req: requset,
    secret: process.env.NEXTAUTH_SECRET ,
  });
  const token = myToken?.routeToken;
  if (!token && protectedRoutes.some((path) => myPath.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', requset.url));
  }
  if (token && authRoutes.some((path) => myPath.startsWith(path))) {
    return NextResponse.redirect(new URL('/', requset.url));
  }
  return NextResponse.next();
}
export const config = {
    matcher: [
    '/profile/address/:path*',
    '/profile/settings/:path*',
    '/checkout/:path*',
    '/cart',
    '/wishlist',
    '/login',
    '/register',
    '/forget-password',
    '/forget-password/otp',
    '/forget-password/new-password',
  ],
};