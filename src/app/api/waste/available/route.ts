import { NextRequest, NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Conforme documentação, esta rota não requer autenticação
    const response = await fetchWrapperApi(`/api/waste/available${queryString ? `?${queryString}` : ''}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Erro na requisição para backend:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro no backend: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    console.log("Resposta do backend /waste/available:", {
      ok: response.ok,
      status: response.status,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      data: response.data
    });

    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Erro interno na API route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
