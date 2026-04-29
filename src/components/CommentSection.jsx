import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [user, setUser] = useState(null);
    const [postAuthor, setPostAuthor] = useState(null);

    useEffect(() => {
        fetchComments();
        getUser();
        getPostAuthor();
    }, []);

    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };

    const getPostAuthor = async () => {
        const { data } = await supabase
            .from("posts")
            .select("user_id")
            .eq("id", postId)
            .single();

        setPostAuthor(data?.user_id);
    };

    const fetchComments = async () => {
        const { data } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

        setComments(data || []);
    };

    const addComment = async () => {
        if (!text.trim()) return;

        const { data: userData } = await supabase.auth.getUser();

        await supabase.from("comments").insert([
            {
                post_id: postId,
                content: text,
                user_id: userData?.user?.id,
            }
        ]);

        setText("");
        fetchComments();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addComment();
        }
    };

    return (
        <div style={wrapper}>
            <h3 style={{ color: "black", textAlign: "left" }}>Comments</h3>

            {comments.map((c) => {
                const isAuthor = c.user_id === postAuthor;

                return (
                    <div key={c.id} style={commentBox}>
                        <div style={header}>
                            <span style={username}>
                                {c.user_id?.slice(0, 8)}
                            </span>

                            <span style={time}>
                                {getTimeAgo(c.created_at)}
                            </span>

                            {isAuthor && (
                                <span style={authorTag}>by author</span>
                            )}
                        </div>

                        <p style={content}>{c.content}</p>

                        <div style={actions}>
                            <button style={btn}>👍 Upvote</button>
                            <button style={btn}>💬 Reply</button>
                        </div>
                    </div>
                );
            })}

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write comment..."
                style={inputStyle}
            />
        </div>
    );
}

function getTimeAgo(date) {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 29030400) return `${Math.floor(diff / 2419200)} months ago`;
    return `${Math.floor(diff / 29030400)} years ago`;
}

const wrapper = {
    marginTop: "30px",
    width: "100%",
};

const commentBox = {
    background: "#f9f9f9",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
    textAlign: "left"
};

const header = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "5px"
};

const username = {
    fontWeight: "bold",
    color: "black"
};

const time = {
    fontSize: "12px",
    color: "gray"
};

const authorTag = {
    fontSize: "12px",
    color: "red",
    fontWeight: "bold"
};

const content = {
    color: "black",
    marginBottom: "8px"
};

const actions = {
    display: "flex",
    gap: "10px"
};

const btn = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "blue"
};

const inputStyle = {
    width: "90%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "20px",
    border: "2px solid black",
    backgroundColor: "white",
    color: "black"
};