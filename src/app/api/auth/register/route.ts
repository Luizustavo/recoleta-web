import { NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { name, email, password } = req;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const { ok, data, status, statusText } = await fetchWrapperApi(
      "/user", 
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

    console.log("Register API response:", { ok, status, data });

    if (!ok) {
      return NextResponse.json(
        { error: statusText || "Erro ao criar conta" },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conta criada com sucesso!",
      data,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
