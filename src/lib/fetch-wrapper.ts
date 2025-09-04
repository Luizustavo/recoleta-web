export async function fetchWrapper<T = unknown>(
  input: string | Request,
  init?: RequestInit,
  logoutWhen401: boolean | undefined = true
): Promise<Response & { data: T }> {
  const url = typeof input === "string" ? input : input.url;
console.log('url ', url)
console.log('init', init)

  const fetchResponse = await fetch(url, init);


  if (logoutWhen401 && fetchResponse.status === 401) {
    await fetch(`/api/auth`, { method: "DELETE" });
    window.location.reload();
  }

  const cloned = fetchResponse.clone();

  let json: T = {} as T;
  try {
    json = (await cloned.json()) as T;
  } catch (error: unknown) {} // eslint-disable-line

  const customResponse = fetchResponse as Response & { data: T };
  customResponse.data = json;
  return customResponse;
}

export async function fetchWrapperApi<T = unknown>(
  input: string | Request,
  init?: RequestInit
): Promise<Response & { data: T }> {
  const baseUrl = process.env.API_URL;
  const url = typeof input === "string" ? input : input.url;

  const fetchResponse = await fetch(`${baseUrl}${url}`, init);

  const cloned = fetchResponse.clone();

  let json: T = {} as T;
  try {
    json = (await cloned.json()) as T;
    //eslint-disable-next-line
  } catch (error: unknown) {}

  const customResponse = fetchResponse as Response & { data: T };

  customResponse.data = json;

  return customResponse;
}
