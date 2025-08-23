interface SerperOrganicResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
  imageUrl?: string;
  source?: string;
}

interface SerperAPIResponse {
  organic: SerperOrganicResult[];
}

export const searchSerper = async (query: string): Promise<SerperOrganicResult[]> => {
  const apiKey = import.meta.env.VITE_SERPER_API_KEY;
  if (!apiKey) {
    console.error("Serper API key is not configured.");
    return [];
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Serper API error: ${response.status} - ${errorText}`);
    }

    const data: SerperAPIResponse = await response.json();
    return data.organic || [];
  } catch (error) {
    console.error("Error fetching from Serper API:", error);
    return [];
  }
};