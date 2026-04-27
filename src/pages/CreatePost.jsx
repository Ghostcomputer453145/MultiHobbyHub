import { useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function CreatePost() {
    const { selectedTheme } = useContext(ThemeContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image_url, setImage] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        await supabase.from("posts").insert([
            { title, content, image_url, category: selectedTheme }
        ]);

        navigate("/");
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={titleStyle}>Create Post</h1>

                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

                <textarea
                    placeholder="Content (Optional)"
                    onChange={(e) => setContent(e.target.value)}
                    style={{ ...inputStyle, height: "180px" }}
                />

                <input placeholder="Image URL (Optional)" onChange={(e) => setImage(e.target.value)} style={inputStyle} />

                <button style={btnStyle}>Create Post</button>
            </form>
        </div>
    );
}

const formStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "500px"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    boxSizing: "border-box"
};

const titleStyle = {
    color: "gold",
    textShadow: "3px 3px 0 black"
};

const btnStyle = {
    width: "100%",
    padding: "12px",
    fontWeight: "bold"
};