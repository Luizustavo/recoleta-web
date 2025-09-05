import { NextRequest, NextResponse } from 'next/server';
import { validateTokenWithBody } from '@/lib/token-validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token não fornecido' },
        { status: 400 }
      );
    }

    const result = await validateTokenWithBody(token);

    if (result.valid) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(
        { valid: false, message: 'Token inválido' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return NextResponse.json(
      { valid: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
