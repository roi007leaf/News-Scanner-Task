import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NewsArticle, summarizeArticle, SummaryResponse } from "../api/news";
import { useNewsInfiniteQuery } from "../hooks/newsHooks";
import { cn } from "../lib/utils";
import { BulkSummaryFab } from "./BulkSummaryFab";
import { NewsCard } from "./NewsCard";

interface NewsDisplayProps {
  query: string;
  category: string;
  shouldFetch: boolean;
  onFetchComplete?: () => void;
}

export const NewsDisplay = ({
  query,
  category,
  shouldFetch,
  onFetchComplete,
}: NewsDisplayProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [summaryByUrl, setSummaryByUrl] = useState<Record<string, SummaryResponse>>({});
  const [expandedByUrl, setExpandedByUrl] = useState<Record<string, boolean>>({});
  const [generatingByUrl, setGeneratingByUrl] = useState<Record<string, boolean>>({});
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(
    null
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useNewsInfiniteQuery({
    query,
    category,
    enabled: false, // Only fetch when triggered
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (shouldFetch && query && category) {
      setSummaryByUrl({});
      setExpandedByUrl({});
      setGeneratingByUrl({});
      setBulkProgress(null);

      refetch().then(() => {
        onFetchComplete?.();
      });
    }
  }, [shouldFetch, query, category, refetch, onFetchComplete]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  // Flatten all articles from all pages
  const articles: NewsArticle[] =
    data?.pages.flatMap((page) => page.articles) ?? [];

  const articlesToSummarize = useMemo(
    () => articles.filter((a) => !summaryByUrl[a.url]),
    [articles, summaryByUrl]
  );
  const summarizeCount = articlesToSummarize.length;

  const runSummariesWithConcurrency = useCallback(
    async (
      items: NewsArticle[],
      concurrency: number,
      worker: (item: NewsArticle) => Promise<void>
    ) => {
      let index = 0;
      const runners = new Array(Math.max(1, concurrency)).fill(null).map(async () => {
        while (index < items.length) {
          const current = items[index++];
          await worker(current);
        }
      });
      await Promise.all(runners);
    },
    []
  );

  const handleGenerateAllSummaries = useCallback(async () => {
    if (bulkProgress || summarizeCount === 0) return;

    setBulkProgress({ done: 0, total: summarizeCount });

    const worker = async (article: NewsArticle) => {
      setGeneratingByUrl((prev) => ({ ...prev, [article.url]: true }));
      try {
        const data = await summarizeArticle({
          title: article.title,
          description: article.description,
          content: article.content,
          source: article.source.name,
          url: article.url,
        });

        setSummaryByUrl((prev) => ({ ...prev, [article.url]: data }));
        setExpandedByUrl((prev) => (article.url in prev ? prev : { ...prev, [article.url]: false }));
      } catch {
        console.warn(`Failed to summarize article: ${article.url}`);
      } finally {
        setGeneratingByUrl((prev) => {
          const next = { ...prev };
          delete next[article.url];
          return next;
        });
        setBulkProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }
    };

    // Gentle concurrency to avoid rate-limits.
    await runSummariesWithConcurrency(articlesToSummarize, 2, worker);
    setBulkProgress(null);
  }, [articlesToSummarize, bulkProgress, runSummariesWithConcurrency, summarizeCount]);

  if (!data && !isLoading) {
    return (
      <div className="text-center text-gray-500 py-12">
        Select a category, enter a search query, and click "Fetch News" to get
        started.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="animate-pulse">Loading news articles...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-12">
        Error loading news:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No articles found. Try a different search query or category.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {articles.length > 0 && (
        <BulkSummaryFab
          count={summarizeCount}
          isBusy={!!bulkProgress}
          progress={bulkProgress ?? undefined}
          onClick={handleGenerateAllSummaries}
        />
      )}

      <div
        className={cn(
          "grid gap-8 items-start justify-items-center",
          "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {articles.map((article, index) => (
          <NewsCard
            key={`${article.url}-${index}`}
            article={article}
            summary={summaryByUrl[article.url] ?? null}
            isExpanded={expandedByUrl[article.url] ?? false}
            isGenerating={!!generatingByUrl[article.url]}
            onSummaryChange={(s) => setSummaryByUrl((prev) => ({ ...prev, [article.url]: s }))}
            onExpandedChange={(next) =>
              setExpandedByUrl((prev) => ({ ...prev, [article.url]: next }))
            }
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && (
        <div className="text-center text-gray-500 py-4">
          <div className="animate-pulse">Loading more articles...</div>
        </div>
      )}

      {!hasNextPage && articles.length > 0 && (
        <div className="text-center text-gray-400 py-4">
          You've reached the end of the results.
        </div>
      )}
    </div>
  );
};
