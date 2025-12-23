export function NewsCardTitle({ title }: { title: string }) {
  return (
    <div className="pt-[16px] pr-[16px] pb-[16px] pl-[6px]">
      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
        {title}
      </h3>
    </div>
  );
}

export function NewsCardDescription({ description }: { description?: string | null }) {
  return (
    <div className="pr-[16px] pb-[16px] pl-[6px] flex flex-col gap-[8px]">
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {description || "No description available."}
      </p>
    </div>
  );
}
