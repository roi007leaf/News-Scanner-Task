import axiosInstance from "../http-client";

export interface Category {
  value: string;
  displayName: string;
}

export interface CategoriesResponse {
  categories: Category[];
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

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  sourceIds: string[];
}

export interface SummaryRequest {
  title: string;
  description: string | null;
  content: string | null;
  source: string;
  url: string;
}

export interface SummaryResponse {
  summary: string;
  violation: string;
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  const response = await axiosInstance.get<CategoriesResponse>(
    "/api/categories"
  );
  return response.data;
}

export async function fetchNews(params: {
  category: string;
  query: string;
  page: number;
  pageSize?: number;
}): Promise<NewsResponse> {
  const response = await axiosInstance.get<NewsResponse>("/api/news", {
    params: {
      category: params.category,
      query: params.query,
      page: params.page,
      pageSize: params.pageSize || 6,
    },
  });
  return response.data;
}

export async function summarizeArticle(
  article: SummaryRequest
): Promise<SummaryResponse> {
  const response = await axiosInstance.post<SummaryResponse>(
    "/api/summary",
    article
  );
  return response.data;
}
