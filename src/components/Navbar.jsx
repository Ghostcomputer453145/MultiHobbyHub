import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Navbar() {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        alert("Logged out");
    };

    return (
        <nav>
            <h2>HobbyHub</h2>

            <div>
                <Link to="/">Home</Link>{" "}
                <Link to="/create">Create Post</Link>{" "}
                <Link to="/auth">Login</Link>{" "}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}