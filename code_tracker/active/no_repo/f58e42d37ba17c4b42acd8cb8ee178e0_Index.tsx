¨import { useState } from "react";
import { getToolsByCategory, categories, type Category, type Pricing } from "@/data/tools";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import SalesCalculator from "@/components/SalesCalculator";
import CallFunnelCalculator from "@/components/CallFunnelCalculator";
import EmailFunnelCalculator from "@/components/EmailFunnelCalculator";
import ProspectFunnelCalculator from "@/components/ProspectFunnelCalculator";
import SalesWizard from "@/components/tools/SalesWizard";
import TemplateLibrary from "@/components/tools/TemplateLibrary";
import TimeBlockingStrategy from "@/components/TimeBlockingStrategy";
import NoCounter from "@/components/NoCounter";
import FullCatalogExport from "@/components/FullCatalogExport";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToolSearch } from "@/hooks/useToolSearch";

const Index = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get filtered tools based on search
  const filteredTools = useToolSearch(searchQuery);

  // Get only main categories (those without parentId)
  const mainCategories = categories.filter(category => !category.parentId);

  // Set first category as default
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    mainCategories[0]?.id || ""
  );

  // Find the selected category object
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen">
      {/* SEO Meta */}
      <title>
        {language === "es"
          ? "Herramientas Digitales | ColecciÃ³n Curada para Marketing y Productividad"
          : "Digital Tools | Curated Collection for Marketing and Productivity"
        }
      </title>

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* NO â†’ YES Counter */}
      <NoCounter />

      {/* Sales Calculators - Collapsible */}
      <SalesCalculator />
      <CallFunnelCalculator />
      <EmailFunnelCalculator />
      <ProspectFunnelCalculator />

      {/* Time Blocking Strategy */}
      <TimeBlockingStrategy />

      {/* NEW: Static Sales Toolkit (Replaces AI) */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
              {language === "es" ? "Toolkit de Ventas" : "Sales Toolkit"}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {language === "es" ? "Acelera tus resultados" : "Accelerate your results"}
            </h2>
          </div>

          <SalesWizard />
          <TemplateLibrary />
        </div>
      </section>

      {/* Full Catalog Export */}
      <FullCatalogExport />

      {/* Tool Categories Navigation */}
      <CategoryNav
        activeCategory={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
      />

      {/* Tool Categories - Main Content - Only show selected category */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        {selectedCategory && (
          <CategorySection
            key={selectedCategory.id}
            category={selectedCategory}
            index={0}
            filteredTools={searchQuery ? filteredTools : undefined}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
Ÿ *cascade08ŸÙ*cascade08ÙŒ *cascade08ŒÐ*cascade08Ð¨ *cascade082wfile:///C:/Users/Antonio/OneDrive/Downloads/tonos-tool-treasurebox-main/tonos-tool-treasurebox-main/src/pages/Index.tsx