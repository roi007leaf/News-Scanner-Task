import { SummaryResponse } from "../../api/news";
import { cn } from "../../lib/utils";

export function NewsCardSummarySection({
  summary,
  isExpanded,
  suppressSpacing,
}: {
  summary: SummaryResponse;
  isExpanded: boolean;
  suppressSpacing?: boolean;
}) {
  const marginClass = suppressSpacing ? "mt-0" : isExpanded ? "mt-2" : "mt-0";

  return (
    <div
      className={cn(
        "space-y-2 overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        marginClass
      )}
    >
      <div className="border-l-2 border-[#7D5EBA] pl-3 py-1">
        <h4 className="text-xs font-semibold text-[#7D5EBA] mb-1">AI Summary</h4>
        <p className="text-sm text-gray-700 leading-relaxed">{summary.summary}</p>
      </div>

      <div className="border-l-2 border-red-400 pl-3 py-1">
        <h4 className="text-xs font-semibold text-red-600 mb-1">Violation</h4>
        <p className="text-sm text-gray-700 leading-relaxed">{summary.violation}</p>
      </div>
    </div>
  );
}
