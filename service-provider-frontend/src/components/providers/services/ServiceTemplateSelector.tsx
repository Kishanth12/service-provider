"use client";

import { ServiceTemplate } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ServiceTemplateSelectorProps {
  templates: ServiceTemplate[];
  selectedTemplateId: string | null;
  onSelect: (templateId: string) => void;
  existingServiceTemplateIds: string[];
}

export function ServiceTemplateSelector({
  templates,
  selectedTemplateId,
  onSelect,
  existingServiceTemplateIds,
}: ServiceTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => {
        const isSelected = selectedTemplateId === template.id;
        const alreadyAdded = existingServiceTemplateIds.includes(template.id);

        return (
          <Card
            key={template.id}
            role="button"
            tabIndex={alreadyAdded ? -1 : 0}
            onClick={() => !alreadyAdded && onSelect(template.id)}
            onKeyDown={(e) => {
              if (alreadyAdded) return;
              if (e.key === "Enter" || e.key === " ") onSelect(template.id);
            }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 dark:bg-slate-950/40",
              alreadyAdded
                ? "cursor-not-allowed opacity-60 border-slate-200/70 dark:border-slate-800/60"
                : "cursor-pointer border-slate-200/70 hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-300 dark:border-slate-800/60 dark:hover:border-slate-700",
              isSelected &&
                !alreadyAdded &&
                "border-blue-500 ring-2 ring-blue-200/80 dark:ring-blue-900/40",
            )}
          >
            {/* top accent only for selected */}
            {isSelected && !alreadyAdded && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />
            )}

            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1 dark:text-white">
                      {template.title}
                    </h3>

                    {alreadyAdded && (
                      <Badge className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] px-2.5 py-1 shadow-sm">
                        Added
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-300">
                    {template.description}
                  </p>
                </div>

                {/* Selected indicator */}
                {isSelected && !alreadyAdded && (
                  <div className="shrink-0">
                    <div className="h-9 w-9 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm ring-1 ring-blue-200/70 dark:ring-blue-900/40">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* subtle footer hint */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {alreadyAdded
                    ? "Already in your services"
                    : isSelected
                      ? "Selected"
                      : "Click to select"}
                </span>

                {!alreadyAdded && !isSelected && (
                  <span className="hidden sm:inline">Quick add</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
