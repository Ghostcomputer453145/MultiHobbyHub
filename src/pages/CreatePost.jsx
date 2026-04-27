import { useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function CreatePost() {
    const { themes, selectedTheme } = useContext(ThemeContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image_url, setImage] = useState("");
    const [category, setCategory] = useState(selectedTheme);
    const navigate = useNavigate();
    const theme = themes[selectedTheme];
    const handleSubmit = async (e) => {
        e.preventDefault();

        await supabase.from("posts").insert([
            { title, content, image_url, category }
        ]);

        navigate("/");
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px"
        }}>
            <form onSubmit={handleSubmit} style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "400px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}>
                <h2>Create Post</h2>

                <input
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
                />

                <textarea
                    placeholder="Content (Optional)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: "100%",
                        height: "120px",
                        padding: "10px",
                        marginBottom: "15px"
                    }}
                />

                <input
                    placeholder="Image URL (Optional)"
                    value={image_url}
                    onChange={(e) => setImage(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
                >
                    {Object.keys(themes).map((key) => (
                        <option key={key}>{key}</option>
                    ))}
                </select>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: theme.color,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold"
                    }}
                >
                    Create Post
                </button>
            </form>
        </div>
    );
}