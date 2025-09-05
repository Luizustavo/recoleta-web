import { NextResponse } from 'next/server';
import { validateTokenWithHeader } from '@/lib/token-validation';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const authCookieName = process.env.AUTH_COOKIE || 'recoleta_access_token';
    const cookieStore = await cookies();
    const token = cookieStore.get(authCookieName)?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Token não encontrado' },
        { status: 401 }
      );
    }

    const result = await validateTokenWithHeader(token);

    if (result.valid && result.payload) {
      return NextResponse.json({
        user: {
          id: result.payload.sub,
          name: result.payload.name,
          email: result.payload.email,
        },
        token: {
          iat: result.payload.iat,
          exp: result.payload.exp,
        }
      }, { status: 200 });
    } else {
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
