import { betterFetch } from "@better-fetch/fetch";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@/lib/auth";

const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const adminRoutes = ["admin"]; // any admin route needs admin previleges. add more if any route needs to be protected

export default async function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(path);
  const isPasswordRoute = passwordRoutes.includes(path);
  const isAdminRoute = adminRoutes.every(r => path.includes(r));
  const url = request.url;
  const response = NextResponse.next();
  response.headers.set('x-url', url);
 
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie && (isAuthRoute || isPasswordRoute)) {
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