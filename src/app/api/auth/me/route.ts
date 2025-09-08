import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const authCookieName = process.env.AUTH_COOKIE || 'recoleta_access_token';
    const cookieStore = await cookies();
    const token = cookieStore.get(authCookieName)?.value;

    console.log("ME - Token found:", !!token);

    if (!token) {
      return NextResponse.json(
        { message: 'Token não encontrado' },
        { status: 401 }
      );
    }

    // Validar token diretamente com o backend
    const backendUrl = process.env.API_URL || "http://localhost:3004";
    console.log("ME - Validating token with backend:", `${backendUrl}/api/auth/validate`);
    
    const response = await fetch(`${backendUrl}/api/auth/validate`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("ME - Backend response status:", response.status);
    
    if (!response.ok) {
      console.log("ME - Backend validation failed");
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    const result = await response.json();
    console.log("ME - Backend validation result:", result);

    if (result.success && result.data?.valid && result.data?.payload) {
      return NextResponse.json({
        user: {
          id: result.data.payload.id,
          name: result.data.payload.name,
          email: result.data.payload.email,
        },
        token: {
          iat: result.data.payload.iat,
          exp: result.data.payload.exp,
        }
      }, { status: 200 });
    } else {
      console.log("ME - Invalid token response from backend");
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
