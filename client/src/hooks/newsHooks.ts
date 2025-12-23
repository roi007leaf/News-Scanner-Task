import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchNews,
  summarizeArticle,
  type CategoriesResponse,
  type NewsResponse,
  type SummaryRequest,
  type SummaryResponse,
} from "../api/news";

export const queryKeys = {
  categories: () => ["categories"] as const,

  news: (params: { query: string; category: string; pageSize?: number }) =>
    [
      "news",
      {
        query: params.query,
        category: params.category,
        pageSize: params.pageSize ?? 6,
      },
    ] as const,
};

export function useCategoriesQuery() {
  return useQuery<CategoriesResponse>({
    queryKey: queryKeys.categories(),
    queryFn: fetchCategories,
  });
}

export function useNewsInfiniteQuery(params: {
  query: string;
  category: string;
  enabled?: boolean;
  staleTime?: number;
  pageSize?: number;
}) {
  return useInfiniteQuery<NewsResponse>({
    queryKey: queryKeys.news({
      query: params.query,
      category: params.category,
      pageSize: params.pageSize,
    }),
    queryFn: ({ pageParam = 1 }) =>
      fetchNews({
        category: params.category,
        query: params.query,
        page: pageParam as number,
        pageSize: params.pageSize,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: params.enabled ?? false,
    staleTime: params.staleTime ?? 1000 * 60 * 5,
  });
}

export function useSummarizeArticleMutation(options?: {
  onSuccess?: (data: SummaryResponse, variables: SummaryRequest) => void;
  onError?: (error: unknown, variables: SummaryRequest) => void;
}) {
  return useMutation<SummaryResponse, unknown, SummaryRequest>({
    mutationFn: (article) => summarizeArticle(article),
    ...options,
  });
}
