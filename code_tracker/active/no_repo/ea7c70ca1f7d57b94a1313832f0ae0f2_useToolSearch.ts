Ùimport { useState, useMemo } from "react";
import { tools, type Tool } from "@/data/tools";

export const useToolSearch = (searchQuery: string) => {
    const filteredTools = useMemo(() => {
        if (!searchQuery || searchQuery.trim() === "") {
            return tools;
        }

        const query = searchQuery.toLowerCase().trim();

        return tools.filter((tool) => {
            // Search by tool name (highest priority)
            const nameMatch = tool.name.toLowerCase().includes(query);

            // Search by description (both languages)
            const descriptionMatchEs = tool.description.es.toLowerCase().includes(query);
            const descriptionMatchEn = tool.description.en.toLowerCase().includes(query);

            // Fuzzy matching for common typos
            const fuzzyNameMatch = fuzzyMatch(tool.name.toLowerCase(), query);

            return nameMatch || descriptionMatchEs || descriptionMatchEn || fuzzyNameMatch;
        });
    }, [searchQuery]);

    return filteredTools;
};

// Simple fuzzy matching algorithm
function fuzzyMatch(str: string, pattern: string): boolean {
    // Remove spaces and special characters for better matching
    const cleanStr = str.replace(/[^a-z0-9]/g, "");
    const cleanPattern = pattern.replace(/[^a-z0-9]/g, "");

    if (cleanPattern.length === 0) return false;
    if (cleanPattern.length > cleanStr.length) return false;

    let patternIdx = 0;
    let strIdx = 0;

    while (strIdx < cleanStr.length && patternIdx < cleanPattern.length) {
        if (cleanStr[strIdx] === cleanPattern[patternIdx]) {
            patternIdx++;
        }
        strIdx++;
    }

    return patternIdx === cleanPattern.length;
}
Ù*cascade082~file:///C:/Users/Antonio/OneDrive/Downloads/tonos-tool-treasurebox-main/tonos-tool-treasurebox-main/src/hooks/useToolSearch.ts