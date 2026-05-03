import { useState, useContext, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";

export default function CreatePost() {
    const { selectedTheme } = useContext(ThemeContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState(null);
    const [secretKey, setSecretKey] = useState("");
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [videoUrl, setVideoUrl] = useState("");
    const [flag, setFlag] = useState("");
    const [referenceId, setReferenceId] = useState("");
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get("ref");
        if (ref) setReferenceId(ref);
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!secretKey.trim()) {
            alert("Secret key is required to create a post.");
            return;
        }

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
                user_id: userData.user.id,
                secret_key: secretKey,
                flag,
                video_url: videoUrl,
                referenced_post_id: referenceId ? parseInt(referenceId) : null
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

                <label style={label}>Secret Key (Required for edit/delete)</label>
                <input
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    style={inputStyle}
                />

                <label style={label}>Reference Post ID (Optional)</label>
                <input
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    style={inputStyle}
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

                <label style={label}>Post Type</label>
                <select value={flag} onChange={(e) => setFlag(e.target.value)} style={inputStyle}>
                    <option value="">None</option>
                    <option value="Question">Question</option>
                    <option value="Opinion">Opinion</option>
                </select>

                <label style={label}>Video URL (Optional)</label>
                <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    style={inputStyle}
                />

                <label style={label}>Current Video</label>
                {videoUrl && (
                    <div style={{ marginTop: "10px" }}>
                        {getEmbedData(videoUrl).type === "video" ? (
                            <video
                                src={getEmbedData(videoUrl).src}
                                controls
                                style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                }}
                            />
                        ) : (
                            <iframe
                                src={getEmbedData(videoUrl).src}
                                width="100%"
                                height="400"
                                style={{ borderRadius: "10px" }}
                                allowFullScreen
                            />
                        )}
                    </div>
                )}

                <button style={fancyBtn} disabled={uploading}>
                    {uploading ? "Posting..." : "Create Post"}
                </button>
            </form>
        </div>
    );
}

function getEmbedData(url) {
    if (!url) return { type: null };

    if (url.includes("youtu.be") || url.includes("youtube.com")) {
        let id = "";

        if (url.includes("youtu.be")) {
            id = url.split("/").pop().split("?")[0];
        } else {
            const match = url.match(/[?&]v=([^&]+)/);
            id = match ? match[1] : "";
        }

        return {
            type: "iframe",
            src: `https://www.youtube.com/embed/${id}`
        };
    }

    if (url.includes("vimeo.com")) {
        const id = url.split("/").pop();
        return {
            type: "iframe",
            src: `https://player.vimeo.com/video/${id}`
        };
    }

    if (url.match(/\.(mp4|webm|ogg)$/)) {
        return {
            type: "video",
            src: url
        };
    }

    return {
        type: "iframe",
        src: url
    };
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