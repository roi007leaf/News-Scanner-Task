import { cn } from "../../lib/utils";

export function NewsCardImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full h-[224px] rounded-[12px] overflow-hidden bg-gray-100",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/396x224?text=No+Image";
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No Image Available
        </div>
      )}
    </div>
  );
}
