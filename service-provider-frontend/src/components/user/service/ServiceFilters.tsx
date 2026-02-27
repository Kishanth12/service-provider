"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Sparkles } from "lucide-react";
import { ServiceTemplate } from "@/types";

interface ServiceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTemplate: string;
  onTemplateChange: (value: string) => void;
  templates: ServiceTemplate[];
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ServiceFilters({
  searchQuery,
  onSearchChange,
  selectedTemplate,
  onTemplateChange,
  templates,
  sortBy,
  onSortChange,
}: ServiceFiltersProps) {
  return (
    <div className="relative mb-6">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-12 -right-16 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -bottom-12 -left-16 h-56 w-56 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
        {/* top gradient line */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-75" />

        <div className="p-4 sm:p-5">
          {/* Header row */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Filters
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search, filter categories, and sort services
              </p>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Search
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="relative md:col-span-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-11 rounded-xl pl-10 border-slate-200 bg-white shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-800 dark:bg-slate-950/30 dark:focus-visible:ring-slate-700"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4">
              <Select value={selectedTemplate} onValueChange={onTemplateChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
                  <Filter className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
                  <ArrowUpDown className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional helper row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Tip: Use keywords like “cleaning”, “repair”, “home”.</span>
            <span className="hidden sm:inline">Results update instantly.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
