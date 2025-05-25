export async function api<T>(
  input: string,
  init: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }
): Promise<{
  data: T;
  status: number;
}> {
  try {
    const response = await fetch(input, init);
    const data: T = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
