import { headers } from "next/headers";

export async function fetchFromApi<T>(
  endpoint: string,
  method: string = "GET",
  options: RequestInit = {}
): Promise<T | null> {
  // Get the host and protocol for constructing the absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, { method, ...options });

    if (!response.ok) {
      console.error(`Failed to fetch from ${url}: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
}
