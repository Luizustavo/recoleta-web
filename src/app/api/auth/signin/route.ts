import { NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { AccessResultType } from "@/types/auth-type";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { email, password } = req;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Dados de entrada inválidos",
        code: "VALIDATION_ERROR",
        errors: [
          { field: "email", message: "Email é obrigatório" },
          { field: "password", message: "Senha é obrigatória" }
        ].filter((error) => {
          if (error.field === "email" && !email) return true;
          if (error.field === "password" && !password) return true;
          return false;
        })
      }, { status: 400 });
    }

    const param = new URLSearchParams({
      email,
      password,
    });

    const { ok, data, status, statusText } =
      await fetchWrapperApi<AccessResultType>("/api/auth/signIn", {
        method: "POST",
        body: param,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

    console.log("Login API response:", { ok, status, data });

    if (!ok) {
      if (status === 401) {
        return NextResponse.json({
          success: false,
          message: "Credenciais inválidas",
          code: "NOT_FOUND",
          data: null
        }, { status });
      }

      return NextResponse.json({
        success: false,
        message: statusText || "Erro no login",
        code: "VALIDATION_ERROR"
      }, { status });
    }

    // Definir cookie
    if (!data?.data?.access_token) {
      return NextResponse.json({
        success: false,
        message: "Resposta inválida do servidor",
        code: "VALIDATION_ERROR"
      }, { status: 500 });
    }

    (await cookies()).set(AUTH_COOKIE ?? "", data.data.access_token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Assumindo que o data contém o user também (precisa verificar com backend)
    // Para agora, vamos extrair do token se disponível
    return NextResponse.json({
      success: true,
      message: "Login successful",
      code: "SUCCESS",
      data: {
        access_token: data.data.access_token,
        user: {
          id: "extracted_from_token", // Será extraído do token JWT
          email: email,
          name: "extracted_from_token" // Será extraído do token JWT
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
