ž:import { Share2, BarChart3, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { tools, categories } from "@/data/tools";
import ToolSelector from "./ToolSelector";
import authorPhoto from "@/assets/author-profile.png";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const { language } = useLanguage();

  return (
    <header className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 overflow-hidden border-b border-border/40 bg-background/50 backdrop-blur-sm">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Modern Background Decorations with Movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-60 animate-float" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Author Badge (Interactive) */}
        <div className="inline-flex items-center gap-4 mb-10 px-6 py-2 rounded-full bg-card/60 border border-white/10 shadow-subtle animate-fade-in backdrop-blur-md hover:scale-105 hover:shadow-glow transition-all duration-300 cursor-default">
          <img
            src={authorPhoto}
            alt="Author"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
          />
          <span className="text-sm sm:text-base font-medium text-foreground/90 group-hover:text-white transition-colors text-left hidden sm:block">
            {language === "es" ? "Creado para vendedores por un vendedor" : "Created for sellers by a seller"}
          </span>
          <span className="text-sm font-medium text-foreground/90 group-hover:text-white transition-colors text-left sm:hidden">
            {language === "es" ? "Por un vendedor" : "By a seller"}
          </span>
        </div>

        {/* Main Title with Gradient Animation */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in-up text-foreground">
          {language === "es" ? "Herramientas para " : "Digital Tools for "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 animate-shimmer bg-[length:200%_auto]">
            {language === "es" ? "Vendedores Modernos" : "Modern Sellers"}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed animate-fade-in-up delay-100 mb-10 hover:text-foreground/80 transition-colors duration-300">
          {language === "es"
            ? "Potencia tu funnel de ventas con una selecciÃ³n curada de las mejores tecnologÃ­as B2B. Optimiza, automatiza y cierra mÃ¡s tratos."
            : "Supercharge your sales funnel with a curated selection of top B2B technologies. Optimize, automate, and close more deals."
          }
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-fade-in-up delay-150">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder={language === "es" ? "Buscar herramientas por nombre o funciÃ³n..." : "Search tools by name or function..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-12 py-6 text-base bg-card/60 border-border/40 backdrop-blur-md focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:bg-card/80"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2 text-center animate-fade-in">
              {language === "es" ? `Buscando: "${searchQuery}"` : `Searching: "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Stats Grid with Float Effect */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
          <div className="p-4 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border transition-all duration-300 backdrop-blur-md flex flex-col items-center hover:-translate-y-1 hover:shadow-glow hover:border-primary/50 group/stat">
            <Search className="w-6 h-6 text-primary mb-2 animate-bounce group-hover/stat:scale-110 transition-transform" style={{ animationDuration: '3s' }} />
            <div className="font-bold text-2xl text-foreground mb-0.5">{tools.length}+</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
              {language === "es" ? "Herramientas" : "Tools"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border transition-all duration-300 backdrop-blur-md flex flex-col items-center hover:-translate-y-1 hover:shadow-glow hover:border-primary/50 group/stat">
            <Share2 className="w-6 h-6 text-primary mb-2 animate-bounce group-hover/stat:scale-110 transition-transform" style={{ animationDuration: '3.5s' }} />
            <div className="font-bold text-2xl text-foreground mb-0.5">{categories.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
              {language === "es" ? "CategorÃ­as" : "Categories"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border transition-all duration-300 backdrop-blur-md flex flex-col items-center hover:-translate-y-1 hover:shadow-glow hover:border-primary/50 group/stat">
            <BarChart3 className="w-6 h-6 text-primary mb-2 animate-bounce group-hover/stat:scale-110 transition-transform" style={{ animationDuration: '4s' }} />
            <div className="font-bold text-2xl text-foreground mb-0.5">100%</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
              {language === "es" ? "Gratuito" : "Free"}
            </div>
          </div>
        </div>

        {/* Filters/Selector */}
        <div className="animate-fade-in-up delay-300">
          <ToolSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
› *cascade08›û%*cascade08û%ž: *cascade082}file:///C:/Users/Antonio/OneDrive/Downloads/tonos-tool-treasurebox-main/tonos-tool-treasurebox-main/src/components/Header.tsx