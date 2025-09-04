import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/home", "/login"];

const privateRoutes = ["/dashboard", "/discard"];

function isValidJWT(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log("Token expirado");
      return false;
    }

    return true;
  } catch (error) {
    console.log("Token inválido:", error);
    return false;
  }
}

function isAuthenticated(request: NextRequest): boolean {
  const authCookieName = process.env.AUTH_COOKIE || "auth_token";
  const token = request.cookies.get(authCookieName)?.value;

  if (!token || token.trim() === "") {
    return false;
  }

  return isValidJWT(token);
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
    // Suporte para rotas dinâmicas
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2);
      return pathname.startsWith(baseRoute);
    }
    return false;
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const authenticated = isAuthenticated(request);

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
