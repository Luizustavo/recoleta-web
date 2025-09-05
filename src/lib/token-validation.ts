import { fetchWrapperApi } from "./fetch-wrapper";

export interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export interface TokenValidationResponse {
  valid: boolean;
  payload?: TokenPayload;
}

export async function validateTokenWithBody(
  token: string
): Promise<TokenValidationResponse> {
  try {
    const response = await fetchWrapperApi<TokenValidationResponse>(
      "/auth/validate-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return { valid: false };
  }
}

export async function validateTokenWithHeader(
  token: string
): Promise<TokenValidationResponse> {
  try {
    const response = await fetchWrapperApi<TokenValidationResponse>(
      "/auth/validate",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return { valid: false };
  }
}

export async function validateTokenClient(
  token: string
): Promise<TokenValidationResponse> {
  try {
    const response = await fetch("/api/auth/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return { valid: false };
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao validar token no cliente:", error);
    return { valid: false };
  }
}
