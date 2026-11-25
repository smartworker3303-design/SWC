// Reusable skeleton placeholder for product cards while data is loading.
// Shows a shimmering pulse to indicate content is incoming — no full-page spinner.

export default function ProductCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel overflow-hidden flex flex-col relative"
          aria-hidden="true"
        >
          {/* Image placeholder */}
          <div className="h-72 w-full skeleton-shimmer border-b border-gold-500/10 bg-luxury-charcoal" />

          {/* Content placeholder */}
          <div className="p-6 flex flex-col gap-3">
            {/* Category line */}
            <div className="h-2.5 w-24 rounded skeleton-shimmer bg-luxury-charcoal" />
            {/* Title */}
            <div className="h-4 w-4/5 rounded skeleton-shimmer bg-luxury-charcoal" />
            <div className="h-3.5 w-3/5 rounded skeleton-shimmer bg-luxury-charcoal" />
            {/* Stars */}
            <div className="h-3 w-28 rounded skeleton-shimmer bg-luxury-charcoal" />
            {/* Price row */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-900 mt-auto">
              <div className="h-5 w-24 rounded skeleton-shimmer bg-luxury-charcoal" />
              <div className="h-9 w-9 rounded-sm skeleton-shimmer bg-luxury-charcoal" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
