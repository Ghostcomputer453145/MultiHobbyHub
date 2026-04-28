import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.image_url);
    };

    const updatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl = imageUrl;

        if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("post-images")
                .upload(fileName, file);

            if (uploadError) {
                alert("Image upload failed");
                setLoading(false);
                return;
            }

            const { data } = supabase.storage
                .from("post-images")
                .getPublicUrl(fileName);

            finalImageUrl = data.publicUrl;
        }

        const { error } = await supabase
            .from("posts")
            .update({
                title,
                content,
                image_url: finalImageUrl,
            })
            .eq("id", id);

        setLoading(false);

        if (error) {
            alert("Update failed");
            return;
        }

        navigate(`/post/${id}`);
    };

    return (
        <div style={container}>
            <form onSubmit={updatePost} style={form}>
                <h1 style={titleStyle}>Update Post</h1>

                <label style={label}>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={input}
                />

                <label style={label}>Content (Optional)</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ ...input, height: "150px" }}
                />

                <label style={label}>Image URL (Option 1)</label>
                <input
                    value={imageUrl || ""}
                    onChange={(e) => {
                        setImageUrl(e.target.value);
                        setFile(null); // 🔥 FIX
                    }}
                    placeholder="Paste image link here"
                    style={input}
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
                        setImageUrl(""); // 🔥 FIX
                    }}
                    style={input}
                />

                <label style={label}>Current Image</label>
                {(file || imageUrl) && (
                    <img
                        src={file ? URL.createObjectURL(file) : imageUrl}
                        alt="preview"
                        style={{
                            width: "100%",
                            borderRadius: "10px",
                            marginBottom: "10px",
                        }}
                    />
                )}

                <button style={fancyBtn} disabled={loading}>
                    {loading ? "Updating..." : "Update Post"}
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

const form = {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "500px",
};

const label = {
    color: "black",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
};

const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: "8px",
    boxSizing: "border-box",
    color: "black",
};

const titleStyle = {
    color: "gold",
    WebkitTextStroke: "2.5px black",
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