import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
    const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <nav style={{ background: themes[selectedTheme].color }}>
            <h2>{themes[selectedTheme].name}</h2>

            <div>
                <select onChange={(e) => setSelectedTheme(e.target.value)}>
                    {Object.keys(themes).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>

                <Link to="/">Home</Link>
                <Link to="/create">Create Post</Link>

                {!user ? (
                    <Link to="/auth">Login</Link>
                ) : (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
}