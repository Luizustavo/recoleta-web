import { NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { AccessResultType } from "@/types/auth-type";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

export async function POST(request: Request) {
  const req = await request.json();
  const { email, password } = req;

  const param = new URLSearchParams({
    email,
    password,
  });

  const { ok, data, status, statusText } =
    await fetchWrapperApi<AccessResultType>("/auth/signIn", {
      method: "POST",
      body: param,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  console.log("data api", data);

  if (!ok) return NextResponse.json({ error: statusText }, { status });

  (await cookies()).set(AUTH_COOKIE ?? "", data.access_token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  console.log("auth cookie", AUTH_COOKIE);

  return NextResponse.json({ access_token: data.access_token });
}

export async function DELETE() {
  try {
    const authCookieName = AUTH_COOKIE ?? "auth_token";

    const cookieStore = await cookies();

    const clearCookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict" as const,
      maxAge: 0,
      expires: new Date(0),
    };

    cookieStore.set(authCookieName, "", clearCookieOptions);

    if (authCookieName !== "recoleta_access_token") {
      cookieStore.set("recoleta_access_token", "", clearCookieOptions);
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
