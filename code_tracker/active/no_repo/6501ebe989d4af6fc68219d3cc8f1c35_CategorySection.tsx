À.import { useState } from "react";
import { LucideIcon, ChevronDown, Circle } from "lucide-react";
import {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder, Video, Flame, Bot, Cog, DatabaseBackup, Mic
} from "lucide-react";
import { getToolsByCategory, categories, type Category, type Pricing, type Tool } from "@/data/tools";
import { useLanguage } from "@/contexts/LanguageContext";
import ToolCard from "./ToolCard";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Mail, MailCheck, PenTool, BarChart3, Share2, Target, Users, Sparkles, Image,
  GraduationCap, Zap, Folder, Video, Flame, Bot, Cog, DatabaseBackup, Mic
};

const pricingColors: Record<Pricing, string> = {
  free: "text-emerald-500",
  freemium: "text-amber-500",
  paid: "text-rose-500",
};

interface CategorySectionProps {
  category: Category;
  index: number;
  level?: number;
  filteredTools?: Tool[]; // Optional filtered tools from search
}

const CategorySection = ({ category, index, level = 0, filteredTools }: CategorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  // Get tools for this category - use filtered tools if provided, otherwise get all
  const allCategoryTools = getToolsByCategory(category.id);
  const categoryTools = filteredTools
    ? allCategoryTools.filter(tool => filteredTools.some(ft => ft.id === tool.id))
    : allCategoryTools;

  // Get subcategories
  const subCategories = categories.filter(c => c.parentId === category.id);

  const IconComponent = iconMap[category.icon] || Folder;

  // Don't render if no subcategories AND no tools
  if (categoryTools.length === 0 && subCategories.length === 0) return null;

  // Count pricing types in category (including subcategories if it's a main category)
  const allTools = [...categoryTools];
  if (subCategories.length > 0) {
    subCategories.forEach(sub => {
      allTools.push(...getToolsByCategory(sub.id));
    });
  }

  const pricingCounts = allTools.reduce((acc, tool) => {
    acc[tool.pricing] = (acc[tool.pricing] || 0) + 1;
    return acc;
  }, {} as Record<Pricing, number>);

  return (
    <section
      id={category.id}
      className="scroll-mt-14 animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Category Header - Compact clickable row */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-card hover:bg-muted/50 border border-border/40 hover:border-border transition-all duration-150 group"
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-md bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-medium text-sm text-foreground">
            {category.name[language]}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {allTools.length}
          </span>
          {/* Pricing indicators */}
          <div className="flex items-center gap-1.5 ml-2">
            {pricingCounts.free && (
              <div
                className="flex items-center group/price"
                title={language === "es" ? `${pricingCounts.free} gratis` : `${pricingCounts.free} free`}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] group-hover/price:scale-125 transition-transform"
                )} />
              </div>
            )}
            {pricingCounts.freemium && (
              <div
                className="flex items-center group/price"
                title={language === "es" ? `${pricingCounts.freemium} freemium` : `${pricingCounts.freemium} freemium`}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] group-hover/price:scale-125 transition-transform"
                )} />
              </div>
            )}
            {pricingCounts.paid && (
              <div
                className="flex items-center group/price"
                title={language === "es" ? `${pricingCounts.paid} de pago` : `${pricingCounts.paid} paid`}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] group-hover/price:scale-125 transition-transform"
                )} />
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content - Subcategories or Tools */}
      {isOpen && (
        <div className={cn(
          "mt-2 animate-fade-in",
          level === 0 ? "pl-4 sm:pl-6 border-l-2 border-border/20 ml-3.5" : "pl-4"
        )}>
          {subCategories.length > 0 ? (
            <div className="space-y-2">
              {subCategories.map((sub, subIndex) => (
                <CategorySection
                  key={sub.id}
                  category={sub}
                  index={subIndex}
                  level={level + 1}
                  filteredTools={filteredTools}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {categoryTools.map((tool, toolIndex) => (
                <ToolCard key={tool.id} tool={tool} index={toolIndex} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
ó* *cascade08ó*£+*cascade08£+À. *cascade082†file:///C:/Users/Antonio/OneDrive/Downloads/tonos-tool-treasurebox-main/tonos-tool-treasurebox-main/src/components/CategorySection.tsx