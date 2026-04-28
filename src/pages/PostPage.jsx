import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
    };

    const upvote = async () => {
        await supabase
            .from("posts")
            .update({ upvotes: (post.upvotes || 0) + 1 })
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

    if (!post) return <p>Loading...</p>;

    return (
        <div style={container}>
            <div style={card}>
                <p>Posted {getTimeAgo(post.created_at)}</p>

                <h1 style={title}>{post.title}</h1>

                <p>{post.content}</p>

                {post.image_url && (
                    <img src={post.image_url} style={{ width: "100%", marginTop: "15px" }} />
                )}

                <div style={actions}>
                    <button onClick={upvote} style={fancyBtn}>
                        👍 {post.upvotes || 0} upvotes
                    </button>

                    {user && user.id === post.user_id && (
                        <div>
                            <button onClick={() => navigate(`/edit/${id}`)} style={fancyBtn}>✏️ Edit</button>
                            <button onClick={deletePost} style={fancyBtn}>🗑 Delete</button>
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
    marginTop: "40px"
};

const card = {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "700px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
    color: "black"
};

const title = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "black"
};

const actions = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
};

const fancyBtn = {
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "20px",
    padding: "10px 18px",
    fontWeight: "bold",
    fontSize: "25px",
    cursor: "pointer",
    WebkitTextStroke: "1px black",
};