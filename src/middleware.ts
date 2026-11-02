import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Protect the /studio route. Unauthenticated users are redirected to /login
// (configured via the `pages.signIn` option in src/lib/auth.ts).
export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session && request.nextUrl.pathname.startsWith("/studio")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
