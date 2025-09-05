import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateTokenWithHeader } from '@/lib/token-validation';

const publicRoutes = ["/", "/home", "/login"];

const privateRoutes = ["/dashboard", "/discard"];

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const authCookieName = process.env.AUTH_COOKIE || "auth_token";
  const token = request.cookies.get(authCookieName)?.value;

  if (!token || token.trim() === "") {
    return false;
  }

  try {
    const result = await validateTokenWithHeader(token);
    return result.valid;
  } catch (error) {
    console.error('Erro ao validar token no middleware:', error);
    return false;
  }
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true;
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2);
      return pathname.startsWith(baseRoute);
    }
    return false;
  });
}

function isPrivateRoute(pathname: string): boolean {
  return privateRoutes.some((route) => {
    if (route === pathname) return true;
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2);
      return pathname.startsWith(baseRoute);
    }
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const authenticated = await isAuthenticated(request);

  if (isPrivateRoute(pathname) && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && pathname === "/login") {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const redirectUrl =
      callbackUrl && callbackUrl !== "/login" ? callbackUrl : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const response = NextResponse.next();

  if (isPrivateRoute(pathname)) {
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
