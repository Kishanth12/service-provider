import { ProviderService } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, DollarSign } from "lucide-react";

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
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onView(service)}
    >
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">
          {service.serviceTemplate?.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {service.serviceTemplate?.description}
        </p>

        <div className="mb-4 pb-4 border-b">
          <p className="text-xs text-slate-500">Provider</p>
          <p className="font-medium">{service.provider?.user?.name}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              ${service.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star
              className={`h-4 w-4 ${
                averageRating > 0
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300"
              }`}
            />
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">({reviewCount})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50 p-4">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onView(service);
          }}
        >
          View Details & Book
        </Button>
      </CardFooter>
    </Card>
  );
}
