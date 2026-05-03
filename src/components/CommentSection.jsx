import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import LoadingSpinner from "./LoadingSpinner";

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [replyBox, setReplyBox] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [user, setUser] = useState(null);
    const [postAuthor, setPostAuthor] = useState(null);
    const [postSecretKey, setPostSecretKey] = useState("");
    const [orderBy, setOrderBy] = useState("newest");
    const [expandedReplies, setExpandedReplies] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
        getUser();
        getPostMeta();

        const channel = supabase
            .channel("comments-live")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "comments" },
                () => fetchComments()
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [orderBy, postId]);

    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };

    const getPostMeta = async () => {
        const { data } = await supabase
            .from("posts")
            .select("user_id, secret_key")
            .eq("id", postId)
            .single();

        setPostAuthor(data?.user_id);
        setPostSecretKey(data?.secret_key);
    };

    const fetchComments = async () => {
        setLoading(true);

        let column = "created_at";
        let ascending = false;

        if (orderBy === "oldest") ascending = true;
        if (orderBy === "popular") column = "upvotes";
        if (orderBy === "unpopular") {
            column = "upvotes";
            ascending = true;
        }

        const { data } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order(column, { ascending });

        setComments(data || []);
        setLoading(false);
    };

    const deleteComment = async (comment) => {
        const currentUserId = user?.id;
        const isOwner = currentUserId === comment.user_id;
        const isPostAuthor = currentUserId === postAuthor;

        if (!isOwner && !isPostAuthor) {
            const inputKey = prompt("Enter secret key to delete this comment:");
            if (inputKey !== postSecretKey) {
                alert("Incorrect secret key.");
                return;
            }
        }

        await supabase.from("comments").delete().eq("id", comment.id);
        fetchComments();
    };

    const addComment = async (parentId = null, contentOverride = null) => {
        const contentToUse = contentOverride ?? text;
        if (!contentToUse.trim()) return;

        const { data: userData } = await supabase.auth.getUser();

        await supabase.from("comments").insert([{
            post_id: postId,
            content: contentToUse,
            user_id: userData?.user?.id,
            username: userData?.user?.user_metadata?.username || "Anonymous",
            parent_id: parentId,
            upvotes: 0,
            downvotes: 0
        }]);

        setText("");
        setReplyText("");
        setReplyBox(null);
        fetchComments();
    };

    const toggleReplies = (id) => {
        setExpandedReplies(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const voteComment = async (comment, type) => {
        const newUp = (comment.upvotes || 0) + (type === "up" ? 1 : 0);
        const newDown = (comment.downvotes || 0) + (type === "down" ? 1 : 0);

        await supabase
            .from("comments")
            .update({
                upvotes: newUp,
                downvotes: newDown
            })
            .eq("id", comment.id);

        fetchComments();
    };

    const renderComments = (parentId = null) => {
        return comments
            .filter(c => c.parent_id === parentId)
            .map(c => {
                const replies = comments.filter(r => r.parent_id === c.id);
                const isExpanded = expandedReplies[c.id];
                const isOwner = user?.id === c.user_id;

                return (
                    <div key={c.id} style={{ ...commentBox, marginLeft: parentId ? "20px" : "0px" }}>
                        <div style={header}>
                            <span style={username}>{c.username}</span>
                            <span style={time}>{getTimeAgo(c.created_at)}</span>
                        </div>

                        <p style={content}>{c.content}</p>

                        <div style={actions}>
                            <button style={btn} onClick={() => voteComment(c, "up")}> 👍 {c.upvotes || 0} upvotes </button>
                            <button style={btn} onClick={() => voteComment(c, "down")}> 👎 {c.downvotes || 0} downvotes </button>
                            <button style={btn} onClick={() => setReplyBox(c.id)}> 💬 Reply </button>

                            {isOwner && (
                                <button style={btn} onClick={() => deleteComment(c)}>
                                    🗑 Delete
                                </button>
                            )}
                        </div>

                        {replyBox === c.id && (
                            <input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Reply..."
                                style={inputStyle}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addComment(c.id, replyText);
                                }}
                            />
                        )}

                        {replies.length > 0 && (
                            <button style={btn} onClick={() => toggleReplies(c.id)}>
                                {isExpanded ? "Hide replies" : `View replies (${replies.length})`}
                            </button>
                        )}

                        {isExpanded && renderComments(c.id)}
                    </div>
                );
            });
    };

    return (
        <div style={wrapper}>
            <h3 style={{ color: "black" }}>Comments</h3>

            <select onChange={(e) => setOrderBy(e.target.value)} style={dropdown}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="unpopular">Least Popular</option>
            </select>

            {loading ? <LoadingSpinner /> : renderComments()}

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write comment..."
                style={inputStyle}
                onKeyDown={(e) => {
                    if (e.key === "Enter") addComment();
                }}
            />
        </div>
    );
}

function getTimeAgo(date) {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
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
    padding: "10px",
    marginTop: "10px",
    borderRadius: "20px",
    border: "2px solid black",
    backgroundColor: "white",
    color: "black"
};

const dropdown = {
    width: "180px",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "2px solid black",
    backgroundColor: "white",
    color: "black"
};