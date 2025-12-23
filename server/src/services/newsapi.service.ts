import NewsAPI from "newsapi";

let newsApiClient: NewsAPI | null = null;

function getNewsApiClient(): NewsAPI {
  if (!newsApiClient) {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      throw new Error("NEWSAPI_KEY environment variable is not set");
    }
    newsApiClient = new NewsAPI(apiKey);
  }
  return newsApiClient;
}

export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface FetchNewsParams {
  category: string;
  query: string;
  page: number;
  pageSize: number;
}

export interface FetchNewsResult {
  articles: NewsArticle[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  sourceIds: string[];
}

/**
 * Fetches US English sources for a given category, limited to first 5
 */
async function getSourcesForCategory(category: string): Promise<string[]> {
  const client = getNewsApiClient();

  const response = await client.v2.sources({
    category: category.toLowerCase(),
    language: "en",
    country: "us",
  });

  if (response.status !== "ok" || !response.sources) {
    throw new Error(
      `Failed to fetch sources: ${response.message || "Unknown error"}`
    );
  }

  const sourceIds = response.sources
    .filter((source) => source.id !== null)
    .slice(0, 5)
    .map((source) => source.id as string);

  return sourceIds;
}

export async function fetchNews(
  params: FetchNewsParams
): Promise<FetchNewsResult> {
  const { category, query, page, pageSize } = params;
  const client = getNewsApiClient();

  const sourceIds = await getSourcesForCategory(category);

  if (sourceIds.length === 0) {
    return {
      articles: [],
      totalResults: 0,
      page,
      pageSize,
      hasMore: false,
      sourceIds: [],
    };
  }

  const response = await client.v2.everything({
    q: query,
    sources: sourceIds.join(","),
    page,
    pageSize,
    sortBy: "publishedAt",
  });

  if (response.status !== "ok") {
    throw new Error(
      `Failed to fetch news: ${response.message || "Unknown error"}`
    );
  }

  const articles: NewsArticle[] = response.articles || [];
  const totalResults = response.totalResults || 0;
  const hasMore = page * pageSize < totalResults;

  return {
    articles,
    totalResults,
    page,
    pageSize,
    hasMore,
    sourceIds,
  };
}
