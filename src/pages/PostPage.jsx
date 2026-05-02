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

    useEffect(() => {
        fetchPost();
        getUser();
    }, []);

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

        if (data) {
            generateSummary(data);
        }
    };

    const upvote = async () => {
        await supabase
            .from("posts")
            .update({ upvotes: (post.upvotes || 0) + 1 })
            .eq("id", id);

        fetchPost();
    };

    const downvote = async () => {
        await supabase
            .from("posts")
            .update({ downvotes: (post.downvotes || 0) + 1 })
            .eq("id", id);

        fetchPost();
    };

    const deletePost = async () => {
        if (post.image_url) {
            const fileName = post.image_url.split("/").pop();

            await supabase.storage
                .from("post-images")
                .remove([fileName]);
        }

        await supabase.from("posts").delete().eq("id", id);
        navigate("/");
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
                    },
                    body: JSON.stringify({
                        title: postData.title,
                        content: postData.content || "",
                        upvotes: postData.upvotes || 0,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error("Function failed");

            setSummary(data.summary);
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

                <div style={{
                    marginTop: "20px",
                    background: "#f4f4f4",
                    padding: "15px",
                    borderRadius: "10px"
                }}>
                    <h3>AI Summary</h3>

                    {loadingSummary ? (
                        <LoadingSpinner />
                    ) : (
                        <p>{summary}</p>
                    )}
                </div>

                <p>{post.content}</p>

                {post.image_url && (
                    <img
                        src={post.image_url}
                        style={{ width: "100%", marginTop: "15px" }}
                    />
                )}

                <div style={actions}>
                    <button onClick={upvote} style={fancyBtn}>
                        👍 {post.upvotes || 0} upvotes
                    </button>

                    <button onClick={downvote} style={fancyBtn}>
                        👎 {post.downvotes || 0} downvotes
                    </button>

                    {user && user.id === post.user_id && (
                        <div>
                            <button onClick={() => navigate(`/edit/${id}`)} style={fancyBtn}>
                                ✏️ Edit
                            </button>
                            <button onClick={deletePost} style={fancyBtn}>
                                🗑 Delete
                            </button>
                        </div>
                    )}
                </div>

                <CommentSection postId={id} />
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

const actions = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
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