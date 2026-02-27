import { ProviderService } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, DollarSign, User2, Sparkles } from "lucide-react";

interface ServiceCardProps {
  service: ProviderService;
  onView: (service: ProviderService) => void;
  averageRating?: number;
  reviewCount?: number;
}

export function ServiceCard({
  service,
  onView,
  averageRating = 0,
  reviewCount = 0,
}: ServiceCardProps) {
  const title = service.serviceTemplate?.title ?? "Service";
  const description =
    service.serviceTemplate?.description ?? "No description available.";
  const providerName = service.provider?.user?.name ?? "Unknown Provider";

  const price = service.price;
  const priceText = typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";

  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl cursor-pointer dark:border-slate-800/60 dark:bg-slate-950/40"
      onClick={() => onView(service)}
    >
      {/* top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />

      {/* subtle decorations */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-slate-900/5 dark:bg-white/5" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-slate-900/5 dark:bg-white/5" />

      <CardContent className="p-6">
        {/* Title + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 line-clamp-1 dark:text-white">
            {title}
          </h3>

          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5" />
            Featured
          </span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-5 dark:text-slate-300">
          {description}
        </p>

        {/* Provider */}
        <div className="mb-5 pb-5 border-b border-slate-200/70 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User2 className="h-4 w-4" />
            Provider
          </div>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white line-clamp-1">
            {providerName}
          </p>
        </div>

        {/* Price + Rating */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-300">
              <DollarSign className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Price
              </p>
              <p className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {priceText}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Star
                className={`h-4 w-4 ${
                  averageRating > 0
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({reviewCount})
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Rating
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t border-slate-200/70 bg-slate-50/60 dark:border-slate-800/60 dark:bg-slate-900/20">
        <Button
          className="w-full h-11 rounded-xl shadow-sm transition hover:shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onView(service);
          }}
        >
          View Details &amp; Book
        </Button>
      </CardFooter>
    </Card>
  );
}
