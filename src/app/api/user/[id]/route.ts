import { NextRequest, NextResponse } from "next/server";
import { fetchWrapperApi } from "@/lib/fetch-wrapper";
import { cookies } from "next/headers";

const { AUTH_COOKIE } = process.env;

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const authCookieName = AUTH_COOKIE || "recoleta_access_token";
    const token = cookieStore.get(authCookieName)?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token inválido ou expirado",
        code: "UNAUTHORIZED",
        data: null
      }, { status: 401 });
    }

    const { ok, data, status, statusText } = await fetchWrapperApi(
      `/api/user/${id}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    console.log("Get user by ID API response:", { ok, status, data });

    if (!ok) {
      if (status === 401) {
        return NextResponse.json({
          success: false,
          message: "Token inválido ou expirado",
          code: "UNAUTHORIZED",
          data: null
        }, { status: 401 });
      }

      if (status === 404) {
        return NextResponse.json({
          success: false,
          message: "User not found",
          code: "NOT_FOUND",
          data: null
        }, { status: 404 });
      }

      return NextResponse.json({
        success: false,
        message: statusText || "Erro ao buscar usuário",
        code: "INTERNAL_ERROR"
      }, { status });
    }

    return NextResponse.json({
      success: true,
      message: "User fetched successfully",
      code: "SUCCESS",
      data
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const authCookieName = AUTH_COOKIE || "recoleta_access_token";
    const token = cookieStore.get(authCookieName)?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token inválido ou expirado",
        code: "UNAUTHORIZED",
        data: null
      }, { status: 401 });
    }

    const req = await request.json();
    const { name, email } = req;

    // Validação básica para campos fornecidos
    if (email && !email.includes('@')) {
      return NextResponse.json({
        success: false,
        message: "Dados de entrada inválidos",
        code: "VALIDATION_ERROR",
        errors: [
          { field: "email", message: "Email inválido" }
        ]
      }, { status: 400 });
    }

    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const { ok, data, status, statusText } = await fetchWrapperApi(
      `/api/user/${id}`, 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    console.log("Update user API response:", { ok, status, data });

    if (!ok) {
      if (status === 401) {
        return NextResponse.json({
          success: false,
          message: "Token inválido ou expirado",
          code: "UNAUTHORIZED",
          data: null
        }, { status: 401 });
      }

      if (status === 404) {
        return NextResponse.json({
          success: false,
          message: "User not found",
          code: "NOT_FOUND",
          data: null
        }, { status: 404 });
      }

      if (status === 400) {
        return NextResponse.json({
          success: false,
          message: "Email já está em uso",
          code: "CONFLICT",
          data: null
        }, { status: 400 });
      }

      return NextResponse.json({
        success: false,
        message: statusText || "Erro ao atualizar usuário",
        code: "INTERNAL_ERROR"
      }, { status });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      code: "SUCCESS",
      data
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const authCookieName = AUTH_COOKIE || "recoleta_access_token";
    const token = cookieStore.get(authCookieName)?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Token inválido ou expirado",
        code: "UNAUTHORIZED",
        data: null
      }, { status: 401 });
    }

    const { ok, status, statusText } = await fetchWrapperApi(
      `/api/user/${id}`, 
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    console.log("Delete user API response:", { ok, status });

    if (!ok) {
      if (status === 401) {
        return NextResponse.json({
          success: false,
          message: "Token inválido ou expirado",
          code: "UNAUTHORIZED",
          data: null
        }, { status: 401 });
      }

      if (status === 404) {
        return NextResponse.json({
          success: false,
          message: "User not found",
          code: "NOT_FOUND",
          data: null
        }, { status: 404 });
      }

      return NextResponse.json({
        success: false,
        message: statusText || "Erro ao deletar usuário",
        code: "INTERNAL_ERROR"
      }, { status });
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      code: "SUCCESS",
      data: null
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
