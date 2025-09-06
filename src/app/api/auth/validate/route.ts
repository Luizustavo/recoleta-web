import { NextRequest, NextResponse } from 'next/server';
import { validateTokenWithBody, validateTokenWithHeader } from '@/lib/token-validation';
import { cookies } from 'next/headers';

// POST /api/auth/validate-token (conforme documentação)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token not provided",
        code: "NOT_FOUND",
        data: {
          valid: false
        }
      }, { status: 400 });
    }

    const result = await validateTokenWithBody(token);

    if (result.valid) {
      return NextResponse.json({
        success: true,
        message: "Token validated successfully",
        code: "SUCCESS",
        data: {
          valid: true,
          payload: result.payload
        }
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
        code: "NOT_FOUND",
        data: {
          valid: false
        }
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
      data: {
        valid: false
      }
    }, { status: 500 });
  }
}

// GET /api/auth/validate (conforme documentação)
export async function GET(request: NextRequest) {
  try {
    // Buscar token do header Authorization
    const authHeader = request.headers.get('Authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Se não encontrou no header, buscar no cookie como fallback
    if (!token) {
      const authCookieName = process.env.AUTH_COOKIE || 'recoleta_access_token';
      const cookieStore = await cookies();
      token = cookieStore.get(authCookieName)?.value;
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
        code: "NOT_FOUND",
        data: {
          valid: false
        }
      }, { status: 401 });
    }

    const result = await validateTokenWithHeader(token);

    if (result.valid) {
      return NextResponse.json({
        success: true,
        message: "Token validated successfully",
        code: "SUCCESS",
        data: {
          valid: true,
          payload: result.payload
        }
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
        code: "NOT_FOUND",
        data: {
          valid: false
        }
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Erro na validação do token via header:', error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR", 
      data: {
        valid: false
      }
    }, { status: 500 });
  }
}
