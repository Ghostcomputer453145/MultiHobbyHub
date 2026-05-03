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
    const [videoUrl, setVideoUrl] = useState("");
    const [flag, setFlag] = useState(""); // ✅ NEW: post type

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            alert("Failed to load post");
            return;
        }

        setTitle(data.title || "");
        setContent(data.content || "");
        setImageUrl(data.image_url || "");
        setVideoUrl(data.video_url || "");
        setFlag(data.flag || ""); // ✅ NEW
    };

    const updatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        const key = prompt("Enter secret key:");

        const { data: postData } = await supabase
            .from("posts")
            .select("secret_key")
            .eq("id", id)
            .single();

        if (key !== postData.secret_key) {
            alert("Wrong secret key");
            setLoading(false);
            return;
        }

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
                video_url: videoUrl,
                flag // ✅ NEW: update post type
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
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={input} />

                <label style={label}>Content (Optional)</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ ...input, height: "150px" }}
                />

                {/* ✅ NEW: Post Type */}
                <label style={label}>Post Type</label>
                <select value={flag} onChange={(e) => setFlag(e.target.value)} style={input}>
                    <option value="">None</option>
                    <option value="Question">Question</option>
                    <option value="Opinion">Opinion</option>
                </select>

                <label style={label}>Image URL (Option 1)</label>
                <input
                    value={imageUrl || ""}
                    onChange={(e) => {
                        setImageUrl(e.target.value);
                        setFile(null);
                    }}
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
                    style={dropBox}
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
                    style={input}
                />

                <label style={label}>Current Image</label>
                {(file || imageUrl) && (
                    <img
                        src={file ? URL.createObjectURL(file) : imageUrl}
                        alt="preview"
                        style={preview}
                    />
                )}

                <label style={label}>Video URL</label>
                <input
                    value={videoUrl || ""}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    style={input}
                />

                <label style={label}>Current Video</label>
                {videoUrl && (
                    <video
                        src={videoUrl}
                        controls
                        style={preview}
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