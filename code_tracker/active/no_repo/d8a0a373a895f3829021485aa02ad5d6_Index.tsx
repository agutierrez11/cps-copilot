¨3import { useState, useMemo } from "react";
import { getToolsByCategory, categories, type Category, type Pricing, type Tool, tools } from "@/data/tools";
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

const Index = () => {
  const { language } = useLanguage();

  // Get only main categories (those without parentId)
  const mainCategories = categories.filter(category => !category.parentId);

  // Set first category as default
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    mainCategories[0]?.id || ""
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return undefined;

    const query = searchQuery.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.en.toLowerCase().includes(query) ||
      tool.description.es.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Find the selected category object
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen">
      {/* SEO Meta */}
      <title>
        {language === "es"
          ? "Herramientas Digitales | Colecci√≥n Curada para Marketing y Productividad"
          : "Digital Tools | Curated Collection for Marketing and Productivity"
        }
      </title>

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {searchQuery ? (
        // SEARCH VIEW: Show results immediately
        <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 min-h-[60vh]">
          <div className="space-y-4">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-medium">
                {language === "es"
                  ? `Resultados para "${searchQuery}"`
                  : `Results for "${searchQuery}"`
                }
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredTools?.length || 0} {language === "es" ? "herramientas encontradas" : "tools found"}
              </p>
            </div>

            {mainCategories.map(category => (
              <CategorySection
                key={category.id}
                category={category}
                index={0}
                filteredTools={filteredTools}
              />
            ))}

            {/* No Results State */}
            {filteredTools && filteredTools.length === 0 && (
              <div className="text-center py-12 px-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">üîç</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {language === "es" ? "No encontramos esa herramienta" : "We couldn't find that tool"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {language === "es"
                    ? "¬øCrees que falta alguna herramienta importante en nuestra colecci√≥n? ¬°H√°znoslo saber!"
                    : "Do you think we're missing an important tool in our collection? Let us know!"}
                </p>
                <a
                  href="mailto:antonio@tonos.com?subject=Sugerencia%20de%20Herramienta"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-medium transition-colors shadow-lg hover:shadow-primary/25"
                >
                  {language === "es" ? "Sugerir una Herramienta" : "Suggest a Tool"}
                </a>
              </div>
            )}
          </div>
        </main>
      ) : (
        // DASHBOARD VIEW: Show full content
        <>
          {/* NO ‚Üí YES Counter */}
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

          {/* Tool Categories - Main Content */}
          <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
            {selectedCategory && (
              <CategorySection
                key={selectedCategory.id}
                category={selectedCategory}
                index={0}
              />
            )}
          </main>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;
¸ *cascade08¸¸*cascade08¸Ñ *cascade08Ñû *cascade08û•$*cascade08•$ï% *cascade08ï%µ% *cascade08µ%π%*cascade08π%»% *cascade08»%Ã%*cascade08Ã%˙% *cascade08˙%˚%*cascade08˚%Å& *cascade08Å&Ñ&*cascade08Ñ&ò& *cascade08ò&ú&*cascade08ú&ª& *cascade08ª&º&*cascade08º&¬& *cascade08¬&≈&*cascade08≈&ﬂ& *cascade08ﬂ&„&*cascade08„&á' *cascade08á'â'*cascade08â'è' *cascade08è'ë'*cascade08ë'∂' *cascade08∂'∫'*cascade08∫'‘' *cascade08‘'÷'*cascade08÷'‹' *cascade08‹'ﬁ'*cascade08ﬁ'é( *cascade08é(í(*cascade08í(Â( *cascade08Â(Á(*cascade08Á(Ô( *cascade08Ô(Ò(*cascade08Ò(§) *cascade08§)®)*cascade08®)Ã) *cascade08Ã)Œ)*cascade08Œ)⁄) *cascade08⁄)‹)*cascade08‹)* *cascade08*Ù**cascade08Ù*∞+ *cascade08∞+≥+*cascade08≥+ø+ *cascade08ø+¿+*cascade08¿+»+ *cascade08»+Ã+*cascade08Ã+ï, *cascade08ï,ò,*cascade08ò,¶, *cascade08¶,ß,*cascade08ß,˛, *cascade08˛,Ç-*cascade08Ç-à- *cascade08à-å-*cascade08å-®- *cascade08®-¨-*cascade08¨-º- *cascade08º-¿-*cascade08¿-Ê- *cascade08Ê-Í-*cascade08Í-Ò- *cascade08Ò-ı-*cascade08ı-á. *cascade08á.à.*cascade08à.é. *cascade08é.ë.*cascade08ë.≥. *cascade08≥.∑.*cascade08∑.Œ. *cascade08Œ.œ.*cascade08œ.’. *cascade08’.ÿ.*cascade08ÿ.ú/ *cascade08ú/û/*cascade08û/¬/ *cascade08¬/ƒ/*cascade08ƒ/ˇ/ *cascade08ˇ/Å0*cascade08Å0Ñ0 *cascade08Ñ0Ö0*cascade08Ö0∂0 *cascade08∂0∫0*cascade08∫0ï1 *cascade08ï1ó1*cascade08ó1Œ1 *cascade08Œ1“1*cascade08“1”1 *cascade08”1◊1*cascade08◊1˝1 *cascade08˝1Å2*cascade08Å2Ç2 *cascade08Ç2Ü2*cascade08Ü2’2 *cascade08’2÷2*cascade08÷2Ÿ2 *cascade08Ÿ2⁄2*cascade08⁄2¨3 *cascade082Wfile:///c:/Users/Antonio/OneDrive/Escritorio/tonos-tool-treasurebox/src/pages/Index.tsx