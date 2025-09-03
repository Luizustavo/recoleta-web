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
    path: "/dashboard",
    secure: false,
    httpOnly: true,
  });

  console.log('auth cookie', AUTH_COOKIE)

  return NextResponse.json({ access_token: data.access_token });
}

export async function DELETE() {
  try {
    // ✅ idem no DELETE
    (await cookies()).set(AUTH_COOKIE ?? "auth_token", "", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
