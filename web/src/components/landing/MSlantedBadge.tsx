export function MSlantedBadge({ className = "h-4" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-stretch -skew-x-12 gap-0.5 ${className}`}
      aria-hidden="true"
    >
      <div className="w-1.5 bg-[#0066b1]" />
      <div className="w-1.5 bg-[#1c69d4]" />
      <div className="w-1.5 bg-[#e22718]" />
    </div>
  );
}
