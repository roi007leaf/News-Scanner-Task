import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function NewsCardSummaryButton({
  isLoading,
  hasSummary,
  isExpanded,
  onClick,
}: {
  isLoading: boolean;
  hasSummary: boolean;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-auto pt-[8px]">
      <Button
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "w-full h-[38px]",
          "rounded-[8px]",
          "font-medium text-sm",
          "px-[14px] py-[10px]",
          "transition-all duration-200",
          hasSummary
            ? "bg-white hover:bg-gray-50 border border-[#7D5EBA] text-[#7D5EBA]"
            : "bg-[#7D5EBA] hover:bg-[#6B4FA3] border border-[#7D5EBA] text-white"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : hasSummary ? (
          <span className="flex items-center justify-center gap-1">
            {isExpanded ? "Hide Summary" : "Show Summary"}
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </span>
        ) : (
          "AI Summary"
        )}
      </Button>
    </div>
  );
}
