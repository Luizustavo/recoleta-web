import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.backendToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const authCookieName = process.env.AUTH_COOKIE || "recoleta_access_token";
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    // Set the backend token in the cookie
    response.cookies.set(authCookieName, session.backendToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("✅ Token saved to cookie, redirecting to dashboard");
    
    return response;
  } catch (error) {
    console.error("❌ Error in callback route:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
