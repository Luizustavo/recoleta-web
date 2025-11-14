import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "meio ambiente sustentabilidade";
  const max = searchParams.get("max") || "10";
  const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API KEY do GNews não definida" },
      { status: 500 }
    );
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=pt&max=${max}&token=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      // Cache por 1 hora
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.errors || "Erro ao buscar notícias" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar notícias do GNews:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notícias" },
      { status: 500 }
    );
  }
}
