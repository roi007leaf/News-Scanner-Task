import { ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

export function NewsCardSourceBar({
  sourceName,
  url,
  className,
}: {
  sourceName: string;
  url: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full",
        "bg-[#F5F5F5] rounded-[12px]",
        "px-[16px] py-[13px]",
        "flex items-center justify-between",
        className
      )}
    >
      <div className="flex flex-col gap-[4px]">
        <span className="text-xs text-gray-500">Source</span>
        <span className="text-sm font-medium text-gray-900">{sourceName}</span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[24px] h-[24px] flex-shrink-0 text-gray-400 hover:text-[#7D5EBA] transition-colors"
        title="Open article"
      >
        <ExternalLink className="w-full h-full" />
      </a>
    </div>
  );
}
