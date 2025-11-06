import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL ;

export async function GET(req: NextRequest, { params }: { params: Promise<{ blob: string[] }> }) {
  try {
    const { blob } = await params;
    const blobPath = blob.join("/"); 

    const backendUrl = `${BACKEND_URL}/api/waste-image/${blobPath}`;

    const response = await fetch(backendUrl);

    if (!response.ok) {
      return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar imagem do backend:", error);
    return new NextResponse("Erro ao buscar imagem", { status: 500 });
  }
}
