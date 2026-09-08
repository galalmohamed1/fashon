import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(requset: NextRequest) {
  const protectedRoutes = [
    '/profile/addresses',
    '/profile/settinges',
    '/profile/orders',
    '/checkout',
    '/allorders',
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
    secureCookie: process.env.NODE_ENV === 'production',
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
    '/profile/addresses/:path*',
    '/profile/settinges/:path*',
    '/profile/orders/:path*',
    '/checkout/:path*',
    '/allorders/:path*',
    '/cart',
    '/wishlist',
    '/login',
    '/register',
    '/forget-password',
    '/forget-password/otp',
    '/forget-password/new-password',
  ],
};