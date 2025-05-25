import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { AccessResultType } from "@/types/auth-type";

const { AUTH_COOKIE } = process.env;

export async function POST(request: Request) {
  const req = await request.json();
  console.log("aqui chegou");
  const { email, password } = req;

  const param = new URLSearchParams({
    email,
    password,
  });

  console.log("param", param);
  const { ok, data, status, statusText } =
    await fetchWrapperApi<AccessResultType>("/auth/signIn", {
      method: "POST",
      body: param,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

  if (!ok) return NextResponse.json({ error: statusText }, { status });

  (await cookies()).set(AUTH_COOKIE ?? "", data.accessToken, {
    path: "/dashboard",
    secure: false,
    httpOnly: true,
  });

  return NextResponse.json({ access_token: data.accessToken });
}
