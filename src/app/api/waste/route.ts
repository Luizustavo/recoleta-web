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

    const response = await fetchWrapperApi("/waste", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Erro na requisição para backend:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro no backend: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Erro interno na API route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const response = await fetchWrapperApi("/waste", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erro na requisição para backend:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Erro no backend: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Erro interno na API route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
