import { createContext, useState } from "react";

export const ThemeContext = createContext();

const themes = {
    Gaming: { name: "GameHub", color: "#7c3aed", bg: "/images/gaming.png" },
    Sports: { name: "SportsHub", color: "#16a34a", bg: "/images/sports.png" },
    Tech: { name: "TechHub", color: "#0ea5e9", bg: "/images/tech.png" },
    History: { name: "HistoryHub", color: "#b45309", bg: "/images/history.png" },
    Music: { name: "MusicHub", color: "#db2777", bg: "/images/music.png" },
    Art: { name: "ArtHub", color: "#9333ea", bg: "/images/art.png" },
    Fitness: { name: "FitnessHub", color: "#dc2626", bg: "/images/fitness.png" },
    Travel: { name: "TravelHub", color: "#0891b2", bg: "/images/travel.png" },
    Food: { name: "FoodHub", color: "#ea580c", bg: "/images/food.png" },
    Movies: { name: "MovieHub", color: "#1f2937", bg: "/images/movies.png" },
    Anime: { name: "AnimeHub", color: "#f43f5e", bg: "/images/anime.png" },
    Books: { name: "BookHub", color: "#a16207", bg: "/images/books.png" },
    Science: { name: "ScienceHub", color: "#22c55e", bg: "/images/science.png" },
    Fashion: { name: "FashionHub", color: "#ec4899", bg: "/images/fashion.png" },
    Photography: { name: "PhotoHub", color: "#374151", bg: "/images/photography.png" },
    Cars: { name: "CarHub", color: "#ef4444", bg: "/images/cars.png" },
    Coding: { name: "CodeHub", color: "#06b6d4", bg: "/images/coding.png" },
    Pets: { name: "PetHub", color: "#f59e0b", bg: "/images/pets.png" },
    Planes: { name: "PlaneHub", color: "#84cc16", bg: "/images/planes.png" },
    Business: { name: "BizHub", color: "#64748b", bg: "/images/business.png" }
};

export function ThemeProvider({ children }) {
    const [selectedTheme, setSelectedTheme] = useState(null);

    return (
        <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}