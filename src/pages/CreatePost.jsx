import { useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";


export default function CreatePost() {
    const { selectedTheme } = useContext(ThemeContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const { data: userData } = await supabase.auth.getUser();

        let finalImageUrl = imageUrl;

        if (file) {
            const fileName = `${Date.now()}-${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("post-images")
                .upload(fileName, file);

            if (uploadError) {
                alert("Image upload failed");
                setUploading(false);
                return;
            }

            const { data } = supabase.storage
                .from("post-images")
                .getPublicUrl(fileName);

            finalImageUrl = data.publicUrl;
        }

        const { error } = await supabase.from("posts").insert([
            {
                title,
                content,
                image_url: finalImageUrl,
                category: selectedTheme,
                user_id: userData.user.id
            },
        ]);

        setUploading(false);

        if (error) {
            alert("Failed to create post");
            return;
        }

        navigate("/");
    };

    return (
        <div style={container}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={titleStyle}>Create Post</h1>
                <label style={label}>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                />
                <label style={label}>Content (Optional)</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ ...inputStyle, height: "150px" }}
                />
                <label style={label}>Image URL (Option 1)</label>
                <input
                    value={imageUrl}
                    onChange={(e) => {
                        setImageUrl(e.target.value);
                        setFile(null);
                    }}
                    placeholder="Paste image link here"
                    style={inputStyle}
                />
                <label style={label}>Upload Image (Option 2)</label>
                <div
                    onDrop={(e) => {
                        e.preventDefault();
                        setFile(e.dataTransfer.files[0]);
                        setImageUrl("");
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    style={{
                        border: "2px dashed black",
                        padding: "20px",
                        borderRadius: "15px",
                        marginBottom: "15px",
                        backgroundColor: "white",
                        color: "black",
                        textAlign: "center",
                        cursor: "pointer"
                    }}
                >
                    Drag & Drop Image Here OR Click Below
                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                        setImageUrl("");
                    }}
                    style={inputStyle}
                />

                {file && (
                    <p style={{ color: "black" }}>
                        Selected file: {file.name}
                    </p>
                )}

                <label style={label}>Current Image</label>
                {(file || imageUrl) && (
                    <div style={{ marginTop: "10px" }}>
                        <img
                            src={file ? URL.createObjectURL(file) : imageUrl}
                            alt="preview"
                            style={{
                                width: "100%",
                                borderRadius: "10px",
                                marginTop: "5px",
                            }}
                        />
                    </div>
                )}

                <button style={fancyBtn} disabled={uploading}>
                    {uploading ? "Posting..." : "Create Post"}
                </button>
            </form>
        </div>
    );
}

const container = {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
};

const formStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "500px",
};

const label = {
    color: "black",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    boxSizing: "border-box",
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: "8px",
    color: "black",
};

const titleStyle = {
    color: "gold",
    WebkitTextStroke: "1px black",
};

const fancyBtn = {
    width: "100%",
    padding: "15px",
    fontWeight: "bold",
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "4px solid black",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "25px",
    WebkitTextStroke: "1px black",
};