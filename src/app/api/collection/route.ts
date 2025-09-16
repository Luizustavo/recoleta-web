import { NextRequest, NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookieName = AUTH_COOKIE || "recoleta_access_token";
    const token = cookieStore.get(authCookieName)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação não encontrado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { wasteId } = body;

    if (!wasteId) {
      return NextResponse.json(
        { error: "wasteId é obrigatório" },
        { status: 400 }
      );
    }

    console.log("📝 POST /api/collection - Dados recebidos:", JSON.stringify(body, null, 2));
    console.log("📝 POST /api/collection - Validação wasteId:", {
      wasteId,
      wasteIdType: typeof wasteId,
      wasteIdLength: wasteId?.length,
      isValidObjectId: /^[0-9a-fA-F]{24}$/.test(wasteId)
    });
    console.log("📝 POST /api/collection - Enviando para backend:", {
      url: "/api/collection",
      wasteId,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + "..." : "null"
    });

    const response = await fetchWrapperApi("/api/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ wasteId }),
    });

    console.log("🚀 POST /api/collection - Resposta do backend:", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    // Verificar se a resposta HTTP foi bem sucedida
    if (!response.ok) {
      console.error("❌ Erro HTTP na requisição para backend:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro no backend: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Verificar se o backend retornou success: false mesmo com status 2xx
    const responseData = response.data as { success?: boolean; message?: string; code?: string; data?: unknown };
    if (responseData && responseData.success === false) {
      console.error("❌ Backend retornou erro:", {
        message: responseData.message,
        code: responseData.code,
        data: responseData.data,
        wasteId
      });
      
      // Mapear códigos de erro específicos
      let statusCode = 400;
      let errorMessage = responseData.message || "Erro no backend";
      
      switch (responseData.code) {
        case 'VALIDATION_ERROR':
          statusCode = 400;
          break;
        case 'UNAUTHORIZED':
          statusCode = 401;
          break;
        case 'WASTE_NOT_FOUND':
          statusCode = 404;
          errorMessage = "Resíduo não encontrado";
          break;
        case 'WASTE_NOT_AVAILABLE':
          statusCode = 409;
          errorMessage = "Resíduo não está mais disponível para coleta";
          break;
        case 'USER_IS_OWNER':
          statusCode = 409;
          errorMessage = "Você não pode assinar para coletar seu próprio resíduo";
          break;
        case 'ALREADY_SIGNED':
          statusCode = 409;
          errorMessage = "Você já assinou para coletar este resíduo";
          break;
        default:
          statusCode = 500;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          message: responseData.message,
          code: responseData.code
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(response.data);

  } catch (error) {
    console.error("💥 Erro interno na API route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
