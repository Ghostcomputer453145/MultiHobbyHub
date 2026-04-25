import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image_url, setImage] = useState("");
    const [category, setCategory] = useState("general");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await supabase.from("posts").insert([
            { title, content, image_url, category }
        ]);

        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Title" required onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Content" onChange={(e) => setContent(e.target.value)} />
            <input placeholder="Image URL" onChange={(e) => setImage(e.target.value)} />

            <select onChange={(e) => setCategory(e.target.value)}>
                <option>general</option>
                <option>gaming</option>
                <option>sports</option>
                <option>tech</option>
            </select>

            <button type="submit">Create Post</button>
        </form>
    );
}