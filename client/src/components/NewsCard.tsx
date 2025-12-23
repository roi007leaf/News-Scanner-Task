import { useState } from "react";
import { NewsArticle, SummaryResponse } from "../api/news";
import { useSummarizeArticleMutation } from "../hooks/newsHooks";
import { cn } from "../lib/utils";
import {
    NewsCardDescription,
    NewsCardImage,
    NewsCardSourceBar,
    NewsCardSummaryButton,
    NewsCardSummarySection,
    NewsCardTitle,
} from "./news-card";

interface NewsCardProps {
  article: NewsArticle;
  summary: SummaryResponse | null;
  isExpanded: boolean;
  isGenerating: boolean;
  onSummaryChange: (summary: SummaryResponse) => void;
  onExpandedChange: (isExpanded: boolean) => void;
}

export const NewsCard = ({
  article,
  summary,
  isExpanded,
  isGenerating,
  onSummaryChange,
  onExpandedChange,
}: NewsCardProps) => {
  const [hasEverExpanded, setHasEverExpanded] = useState(false);

  const summaryMutation = useSummarizeArticleMutation({
    onSuccess: (data) => {
      onSummaryChange(data);
      onExpandedChange(true); // Auto-expand when summary is generated
      setHasEverExpanded(true);
    },
  });

  const handleButtonClick = () => {
    if (summary) {
      const next = !isExpanded;
      onExpandedChange(next);
      if (next) setHasEverExpanded(true);
      return;
    }

    summaryMutation.mutate({
      title: article.title,
      description: article.description,
      content: article.content,
      source: article.source.name,
      url: article.url,
    });
  };

  const isLoading = summaryMutation.isPending || isGenerating;

  return (
    <div
      className={cn(
        "flex flex-col",
        "w-[416px]",
        "bg-white rounded-[12px] p-[10px]",
        "shadow-[0_0_32px_rgba(0,0,0,0.07)]",
        "transition-shadow duration-200 hover:shadow-[0_0_40px_rgba(0,0,0,0.12)]"
      )}
    >
      <NewsCardImage src={article.urlToImage} alt={article.title} />

      <NewsCardTitle title={article.title} />
      <NewsCardDescription description={article.description} />

      <NewsCardSourceBar sourceName={article.source.name} url={article.url} />

      {summary && (
        <NewsCardSummarySection
          summary={summary}
          isExpanded={isExpanded}
          // If we never expanded before, keep spacing identical to pre-summary state
          suppressSpacing={!hasEverExpanded && !isExpanded}
        />
      )}

      <NewsCardSummaryButton
        isLoading={isLoading}
        hasSummary={!!summary}
        isExpanded={isExpanded}
        onClick={handleButtonClick}
      />
    </div>
  );
};
