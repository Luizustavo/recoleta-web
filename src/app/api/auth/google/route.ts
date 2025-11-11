import { NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body; // frontend should send Google id_token

  if (!token) {
    return NextResponse.json(
      { error: "Google token missing" },
      { status: 400 }
    );
  }

  const {
    ok,
    data: rawData,
    status,
  } = await fetchWrapperApi("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!ok)
    return NextResponse.json({ error: "Google login failed" }, { status });

  // Validate and type-assert response data
  type GoogleAuthData = { access_token: string; user: Record<string, unknown> };
  const data = (await rawData) as GoogleAuthData;

  // Set cookie
  (await cookies()).set(AUTH_COOKIE ?? "", data.access_token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    access_token: data.access_token,
    user: data.user,
  });
}
