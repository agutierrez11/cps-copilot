Ä#import { useState } from "react";
import { LucideIcon, Gift, DollarSign } from "lucide-react";
import {
  Mail, MailCheck, MailOpen, MailSearch, Send, Flame, FolderCheck, Thermometer, ListChecks,
  ShieldCheck, CheckCircle, Wrench, Shuffle, RefreshCw, FileText, Lightbulb, Languages,
  Bot, Wand2, Ghost, GraduationCap, FileEdit, PenLine, FileDown, RotateCw, ScanSearch,
  Mic, Hash, Search, TrendingUp, Eye, Globe, Layers, Code, FileSearch, Linkedin, Heart,
  BarChart, Handshake, Target, RefreshCcw, PlayCircle, MessageSquare, Brain, BookOpen,
  Book, Users, UserSearch, Database, LineChart, Map, Phone, Rocket, Building2, Building,
  UserPlus, Compass, Cog, Truck, Headphones, MessageCircle, Zap, Sparkle, Package,
  User, Image, Video, Camera, Palette, Play, Presentation, School, Briefcase, Type, Link,
  Workflow, Chrome, Calendar, Sparkles, PieChart, Star, DatabaseBackup
} from "lucide-react";
import type { Tool, Pricing } from "@/data/tools";
import { useLanguage } from "@/contexts/LanguageContext";
import ToolDetailDialog from "./ToolDetailDialog";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Mail, MailCheck, MailOpen, MailSearch, Send, Flame, FolderCheck, Thermometer, ListChecks,
  ShieldCheck, CheckCircle, Wrench, Shuffle, RefreshCw, FileText, Lightbulb, Languages,
  Bot, Wand2, Ghost, GraduationCap, FileEdit, PenLine, FileDown, RotateCw, ScanSearch,
  Mic, Hash, Search, TrendingUp, Eye, Globe, Layers, Code, FileSearch, Linkedin, Heart,
  BarChart, Handshake, Target, RefreshCcw, PlayCircle, MessageSquare, Brain, BookOpen,
  Book, Users, UserSearch, Database, LineChart, Map, Phone, Rocket, Building2, Building,
  UserPlus, Compass, Cog, Truck, Headphones, MessageCircle, Zap, Sparkle, Package,
  User, Image, Video, Camera, Palette, Play, Presentation, School, Briefcase, Type, Link,
  Workflow, Chrome, Calendar, Sparkles, PieChart, Star, DatabaseBackup
};

const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Link;
};

const pricingColors: Record<Pricing, string> = {
  free: "bg-emerald-500",
  freemium: "bg-amber-500",
  paid: "bg-rose-500",
};

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const IconComponent = getIcon(tool.icon);
  const { language } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="group block w-full text-left relative"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="relative h-full bg-card/40 backdrop-blur-md rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border border-white/5 overflow-hidden group-hover:border-primary/20 group-hover:bg-card/60">

          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          {/* Pricing dot indicator */}
          <div
            className={cn(
              "absolute top-3 right-3 w-2 h-2 rounded-full ring-2 ring-background/50 shadow-[0_0_8px_rgba(0,0,0,0.5)]",
              pricingColors[tool.pricing]
            )}
            title={tool.pricing}
          />

          <div className="relative z-10 flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate pr-4">
                {tool.name}
              </h3>
            </div>

            {/* Description - multi line */}
            <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2 pl-1 group-hover:text-foreground/90 transition-colors">
              {tool.description[language]}
            </p>
          </div>
        </div>
      </button>

      <ToolDetailDialog
        tool={tool}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default ToolCard;
Ä#*cascade082_file:///c:/Users/Antonio/OneDrive/Escritorio/tonos-tool-treasurebox/src/components/ToolCard.tsx