import { NextRequest, NextResponse } from 'next/server';
import { validateTokenWithBody } from '@/lib/token-validation';

// POST /api/auth/validate-token (conforme documentação exata)
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
