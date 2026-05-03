import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [summary, setSummary] = useState("");
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [referencedPost, setReferencedPost] = useState(null);
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        fetchPost();
        fetchReplies();
        getUser();
    }, [id]);

    useEffect(() => {
        if (post) generateSummary(post);
    }, [post]);

    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };

    const fetchPost = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

        setPost(data);

        if (data?.referenced_post_id) {
            const { data: ref, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", data.referenced_post_id)
                .single();

            console.log("Referenced post:", ref, error);

            if (!ref) {
                console.warn("Referenced post not found");
            }

            setReferencedPost(ref);
        }

        if (data) {
            generateSummary(data);
        }
    };

    const fetchReplies = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("referenced_post_id", id);

        setReplies(data || []);
    };

    const verifyKey = () => {
        const key = prompt("Enter secret key:");
        return key === post.secret_key;
    };

    const vote = async (type) => {
        let newUp = post.upvotes || 0;
        let newDown = post.downvotes || 0;

        if (type === "up") newUp++;
        else newDown++;

        await supabase
            .from("posts")
            .update({
                upvotes: newUp,
                downvotes: newDown
            })
            .eq("id", id);

        fetchPost();
    };

    const deletePost = async () => {
        if (!verifyKey()) {
            alert("Wrong secret key");
            return;
        }

        if (post.image_url) {
            const fileName = post.image_url.split("/").pop();

            await supabase.storage
                .from("post-images")
                .remove([fileName]);
        }

        await supabase.from("posts").delete().eq("id", id);
        navigate("/");
    };

    const editPost = () => {
        if (!verifyKey()) {
            alert("Wrong secret key");
            return;
        }

        navigate(`/edit/${id}`);
    };

    const generateSummary = async (postData) => {
        setLoadingSummary(true);

        try {
            const res = await fetch(
                "https://bxhpllaejqvwreigemxz.supabase.co/functions/v1/summarize",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify(postData),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSummary(data.summary || "");
        } catch (err) {
            console.error(err);
            setSummary("Failed to generate summary.");
        }

        setLoadingSummary(false);
    };

    if (!post) return <LoadingSpinner />;

    return (
        <div style={container}>
            <div style={card}>
                <p>Posted {getTimeAgo(post.created_at)}</p>
                <h1 style={title}>{post.title}</h1>

                {referencedPost && (
                    <div style={{ marginBottom: "20px", border: "2px solid black", padding: "10px" }}>
                        {referencedPost && (
                            <div style={{
                                border: "3px solid black",
                                padding: "15px",
                                marginBottom: "20px",
                                background: "#eee"
                            }}>
                                <h3>🔗 Referenced Post</h3>
                                <h4>{referencedPost.title}</h4>
                                <p>{referencedPost.content}</p>

                                <button onClick={() => navigate(`/post/${referencedPost.id}`)}>
                                    View Full Post
                                </button>
                            </div>
                        )}
                        <button onClick={() => navigate(`/post/${referencedPost.id}`)}>
                            View Original Post
                        </button>
                    </div>
                )}

                <p>{post.content}</p>

                <div style={summaryBox}>
                    <h3>AI Summary</h3>
                    {loadingSummary ? <LoadingSpinner /> : <p style={summaryText}>{summary}</p>}
                </div>

                {post.image_url && (
                    <img
                        src={post.image_url}
                        style={{ width: "100%", marginTop: "15px" }}
                    />
                )}

                <div style={buttonGrid}>
                    <button onClick={() => vote("up")} style={voteBtn}> 👍 {post.upvotes || 0} upvotes </button>
                    <button onClick={() => vote("down")} style={voteBtn}> 👎 {post.downvotes || 0} downvotes </button>

                    {user && user.id === post.user_id && (
                        <>
                            <button onClick={editPost} style={voteBtn}> ✏️ Edit </button>
                            <button onClick={deletePost} style={voteBtn}> 🗑 Delete </button>
                        </>
                    )}

                    <button onClick={() => navigate(`/create?ref=${post.id}`)} style={repostBtn} > 🔁 Repost </button>
                </div>

                <CommentSection
                    postId={id}
                    postSecretKey={post.secret_key}
                />
            </div>
        </div>
    );
}

function getTimeAgo(date) {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
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

const card = {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "700px",
    maxWidth: "100%",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
    color: "black",
};

const title = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "black",
};

const summaryBox = {
    marginTop: "20px",
    background: "white",
    color: "gold",
    padding: "20px",
    borderRadius: "12px",
    border: "3px solid black",
};

const summaryText = {
    fontWeight: "bold",
    fontSize: "18px",
    color: "black",
};

const actions = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
};

const voteGroup = {
    display: "flex",
    gap: "0px",
};

const voteBtn = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "15px",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
    textAlign: "center",
    WebkitTextStroke: "1px black",
};

const fancyBtn = {
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "20px",
    padding: "10px 18px",
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
    WebkitTextStroke: "1px black",
};

const buttonGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "20px",
    justifyItems: "center",
    alignItems: "center",
};

const repostBtn = {
    gridColumn: "span 2",
    width: "100%",
    padding: "12px",
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "15px",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
    WebkitTextStroke: "1px black",
};