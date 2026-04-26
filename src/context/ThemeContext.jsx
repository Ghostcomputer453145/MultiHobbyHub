import { createContext, useState } from "react";

export const ThemeContext = createContext();

const themes = {
    general: { name: "HobbyHub", color: "#d4af37" },
    gaming: { name: "GameHub", color: "#7c3aed" },
    sports: { name: "SportsHub", color: "#16a34a" },
    tech: { name: "TechHub", color: "#0ea5e9" },
    history: { name: "HistoryHub", color: "#b45309" },
    music: { name: "MusicHub", color: "#db2777" },
    art: { name: "ArtHub", color: "#9333ea" },
    fitness: { name: "FitnessHub", color: "#dc2626" },
    travel: { name: "TravelHub", color: "#0891b2" },
    food: { name: "FoodHub", color: "#ea580c" }
};

export function ThemeProvider({ children }) {
    const [selectedTheme, setSelectedTheme] = useState(null);

    return (
        <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}