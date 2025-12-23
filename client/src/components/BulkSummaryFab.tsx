import { Loader2, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export function BulkSummaryFab({
  count,
  isBusy,
  progress,
  onClick,
}: {
  count: number;
  isBusy: boolean;
  progress?: { done: number; total: number };
  onClick: () => void;
}) {
  const tooltipText = isBusy
    ? `Generating ${progress?.done ?? 0}/${progress?.total ?? count}`
    : count > 0
      ? `Generate AI summaries for ${count} article${count === 1 ? "" : "s"}`
      : "All summaries generated";

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div
        className={cn(
          "pointer-events-none absolute bottom-full right-0 mb-2",
          "hidden group-hover:block",
          "rounded-md bg-gray-900 text-white text-xs",
          "px-3 py-2 shadow-lg",
          "whitespace-nowrap"
        )}
      >
        {tooltipText}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={isBusy || count === 0}
        className={cn(
          "h-12 px-4 rounded-full",
          "flex items-center gap-2",
          "bg-[#7D5EBA] text-white",
          "shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
          "transition-all duration-200",
          "hover:bg-[#6B4FA3] hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)]",
          "disabled:bg-gray-300 disabled:text-gray-600 disabled:hover:bg-gray-300",
          "disabled:cursor-not-allowed"
        )}
        aria-label="Generate AI summaries for all articles"
      >
        {isBusy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}

        <span className="text-sm font-medium">
          {isBusy
            ? `Generating${progress ? ` ${progress.done}/${progress.total}` : "..."}`
            : "Generate Summaries"}
        </span>
      </button>
    </div>
  );
}
