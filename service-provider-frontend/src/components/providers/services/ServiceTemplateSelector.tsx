"use client";

import { ServiceTemplate } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
            className={`cursor-pointer transition-all ${
              isSelected
                ? "border-blue-500 ring-2 ring-blue-200"
                : alreadyAdded
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-slate-300"
            }`}
            onClick={() => !alreadyAdded && onSelect(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{template.title}</h3>
                    {alreadyAdded && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Added
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {template.description}
                  </p>
                </div>
                {isSelected && !alreadyAdded && (
                  <div className="ml-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
