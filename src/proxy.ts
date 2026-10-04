import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. قراءة بيانات تسجيل الدخول
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isAdmin = token?.role === "admin";

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forget-password");

  // 2. الأدمن يدخل على الـ Dashboard فقط (إذا حاول فتح أي صفحة أخرى يتم تحويله للـ Dashboard مباشرة)
  if (isAdmin && !isDashboardRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. حماية الـ Dashboard - للأدمن فقط
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. إذا كان المستخدم مسجل دخول وحاول يفتح صفحة login/register
  if (isAuthenticated && isAuthRoute) {
    const destination = isAdmin ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 5. حماية صفحات المستخدم الخاصة
  const protectedRoutes = [
    "/profile",
    "/checkout",
    "/allorders",
    "/cart",
    "/wishlist",
  ];

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // استثناء الملفات الثابتة والـ API من الفحص
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)",
  ],
};
