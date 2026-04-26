import { createContext, useState } from "react";

export const ThemeContext = createContext();

const themes = {
    Gaming: { name: "GameHub", color: "#7c3aed" },
    Sports: { name: "SportsHub", color: "#16a34a" },
    Tech: { name: "TechHub", color: "#0ea5e9" },
    History: { name: "HistoryHub", color: "#b45309" },
    Music: { name: "MusicHub", color: "#db2777" },
    Art: { name: "ArtHub", color: "#9333ea" },
    Fitness: { name: "FitnessHub", color: "#dc2626" },
    Travel: { name: "TravelHub", color: "#0891b2" },
    Food: { name: "FoodHub", color: "#ea580c" },
    Movies: { name: "MovieHub", color: "#1f2937" },
    Anime: { name: "AnimeHub", color: "#f43f5e" },
    Books: { name: "BookHub", color: "#a16207" },
    Science: { name: "ScienceHub", color: "#22c55e" },
    Fashion: { name: "FashionHub", color: "#ec4899" },
    Photography: { name: "PhotoHub", color: "#374151" },
    Cars: { name: "CarHub", color: "#ef4444" },
    Coding: { name: "CodeHub", color: "#06b6d4" },
    Pets: { name: "PetHub", color: "#f59e0b" },
    Diy: { name: "DIYHub", color: "#84cc16" },
    Business: { name: "BizHub", color: "#64748b" }
};

export function ThemeProvider({ children }) {
    const [selectedTheme, setSelectedTheme] = useState(null);

    return (
        <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}