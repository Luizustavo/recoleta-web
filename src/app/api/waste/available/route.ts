import { NextRequest, NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

interface BackendResponse {
  success: boolean;
  data: {
    items: unknown[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
  code: string;
}

export async function GET(request: NextRequest) {
  try {
    // Validar token de autenticação
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

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Esta rota agora requer autenticação
    const response = await fetchWrapperApi<BackendResponse>(`/api/waste/available${queryString ? `?${queryString}` : ''}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erro na requisição para backend:", response.status, response.statusText);
      
      if (response.status === 401) {
        return NextResponse.json({
          success: false,
          message: "Token inválido ou expirado",
          code: "UNAUTHORIZED",
          data: null
        }, { status: 401 });
      }

      return NextResponse.json({
        success: false,
        message: `Erro no backend: ${response.status} ${response.statusText}`,
        code: "INTERNAL_ERROR"
      }, { status: response.status });
    }

    console.log("Resposta do backend /waste/available:", {
      ok: response.ok,
      status: response.status,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      data: response.data
    });

    // O backend já retorna a estrutura completa, então vamos repassar diretamente
    // ou extrair apenas os dados necessários
    if (response.data && response.data.success) {
      return NextResponse.json({
        success: true,
        message: response.data.message || "Available waste types fetched successfully",
        code: "SUCCESS",
        data: response.data.data // Aqui está o objeto com items, page, limit, etc.
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Erro ao processar dados do backend",
        code: "INTERNAL_ERROR"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Erro interno na API route:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
