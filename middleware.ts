import { betterFetch } from "@better-fetch/fetch";
// import { Session } from "better-auth";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
// import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";

const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const adminRoutes = ["admin"]; //,"/admin/product-list","/admin/product/add"
const adminPath = "admin";
// export function middleware(request: NextRequest) {
//   const url = request.url;
//   const response = NextResponse.next();
//   response.headers.set('x-url', url);
//   return response;
// }

export default async function authMiddleware(request: NextRequest) {
  // const path = NextResponse.next().url;
  const path = request.nextUrl.pathname;
  // console.log('path: ', path)
  // console.log('adminPath.includes: ', path.includes(adminPath))
  // console.log('adminRoutes.includes: ', adminRoutes.every(r => path.includes(r)))
  const isAuthRoute = authRoutes.includes(path);
  const isPasswordRoute = passwordRoutes.includes(path);
  const isAdminRoute = adminRoutes.every(r => path.includes(r));
  const url = request.url;
  const response = NextResponse.next();
  response.headers.set('x-url', url);
 
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }
    // return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute) {
    const {data: session} = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: process.env.BETTER_AUTH_URL,
        headers: {
          cookie: request.headers.get('cookie') || '',
        }
      }
    );

    if(!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};