import { NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { name, email, password } = req;

    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Dados de entrada inválidos",
        code: "VALIDATION_ERROR",
        errors: [
          { field: "name", message: "Nome é obrigatório" },
          { field: "email", message: "Email é obrigatório" }, 
          { field: "password", message: "Senha é obrigatória" }
        ].filter((error) => {
          if (error.field === "name" && !name) return true;
          if (error.field === "email" && !email) return true;
          if (error.field === "password" && !password) return true;
          return false;
        })
      }, { status: 400 });
    }

    const { ok, data, status, statusText } = await fetchWrapperApi(
      "/api/user", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    console.log("User registration API response:", { ok, status, data });

    if (!ok) {
      // Tentar mapear erros do backend para formato da documentação
      if (status === 400) {
        return NextResponse.json({
          success: false,
          message: statusText || "Email já está em uso",
          code: "CONFLICT",
          data: null
        }, { status });
      }

      return NextResponse.json({
        success: false,
        message: statusText || "Erro ao criar usuário",
        code: "VALIDATION_ERROR"
      }, { status });
    }

    // Retornar conforme documentação
    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      code: "SUCCESS",
      data
    });
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authCookieName = AUTH_COOKIE || "recoleta_access_token";
    const token = cookieStore.get(authCookieName)?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token inválido ou expirado",
        code: "UNAUTHORIZED",
        data: null
      }, { status: 401 });
    }

    // Obter parâmetros de paginação da URL
    const { searchParams } = new URL(request.url);
    const skip = searchParams.get('skip');
    const take = searchParams.get('take');
    
    let queryString = '';
    const params = new URLSearchParams();
    if (skip !== null) params.append('skip', skip);
    if (take !== null) params.append('take', take);
    if (params.toString()) queryString = `?${params.toString()}`;

    const { ok, data, status, statusText } = await fetchWrapperApi(
      `/api/user${queryString}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    console.log("Get users API response:", { ok, status, data });

    if (!ok) {
      if (status === 401) {
        return NextResponse.json({
          success: false,
          message: "Token inválido ou expirado",
          code: "UNAUTHORIZED",
          data: null
        }, { status: 401 });
      }

      return NextResponse.json({
        success: false,
        message: statusText || "Erro ao buscar usuários",
        code: "INTERNAL_ERROR"
      }, { status });
    }

    // Retornar conforme documentação
    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      code: "SUCCESS",
      data
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
