import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [replyBox, setReplyBox] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [user, setUser] = useState(null);
    const [postAuthor, setPostAuthor] = useState(null);
    const [orderBy, setOrderBy] = useState("newest");
    const [expandedReplies, setExpandedReplies] = useState({});

    useEffect(() => {
        fetchComments();
        getUser();
        getPostAuthor();

        const channel = supabase
            .channel("comments-live")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "comments" },
                () => fetchComments()
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [orderBy]);

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
    };

    const deleteComment = async (id) => {
        await supabase.from("comments").delete().eq("id", id);
    };

    const vote = async (commentId, type) => {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) return;

        const field = type === "up" ? "upvotes" : "downvotes";
        const oppositeField = type === "up" ? "downvotes" : "upvotes";

        const { data: existing } = await supabase
            .from("votes")
            .select("*")
            .eq("user_id", userId)
            .eq("comment_id", commentId)
            .single();

        const { data: freshComment } = await supabase
            .from("comments")
            .select("upvotes, downvotes")
            .eq("id", commentId)
            .single();

        if (!freshComment) return;

        let up = freshComment.upvotes || 0;
        let down = freshComment.downvotes || 0;

        if (!existing) {
            await supabase.from("votes").insert([{
                user_id: userId,
                comment_id: commentId,
                type
            }]);

            if (type === "up") up++;
            else down++;
        }

        else if (existing.type !== type) {
            await supabase
                .from("votes")
                .update({ type })
                .eq("id", existing.id);

            if (type === "up") {
                up++;
                down = Math.max(down - 1, 0);
            } else {
                down++;
                up = Math.max(up - 1, 0);
            }
        }

        else {
            return;
        }

        await supabase
            .from("comments")
            .update({ upvotes: up, downvotes: down })
            .eq("id", commentId);

        fetchComments();
    };

    const toggleReplies = (id) => {
        setExpandedReplies(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderComments = (parentId = null) => {
        return comments
            .filter(c => c.parent_id === parentId)
            .map(c => {
                const replies = comments.filter(r => r.parent_id === c.id);
                const hasReplies = replies.length > 0;
                const isExpanded = expandedReplies[c.id];
                const isAuthor = c.user_id === postAuthor;
                const isOwner = user?.id === c.user_id;

                return (
                    <div key={c.id} style={{ ...commentBox, marginLeft: parentId ? "20px" : "0px" }}>
                        <div style={header}>
                            <span style={username}>{c.username}</span>
                            <span style={time}>{getTimeAgo(c.created_at)}</span>
                            {isAuthor && <span style={authorTag}>by author</span>}
                        </div>

                        <p style={content}>{c.content}</p>

                        <div style={actions}>
                            <button style={btn} onClick={() => vote(c.id, "up")}> 👍 {c.upvotes || 0} upvotes </button>
                            <button style={btn} onClick={() => vote(c.id, "down")}>👎 {c.downvotes || 0} downvotes </button>
                            <button style={btn} onClick={() => setReplyBox(c.id)}> 💬 Reply </button>
                            {isOwner && (<button style={btn} onClick={() => deleteComment(c.id)}> 🗑 Delete </button>)}
                        </div>
                        {hasReplies && (
                            <button style={btn} onClick={() => toggleReplies(c.id)}>
                                {isExpanded
                                    ? "▼ Hide replies"
                                    : `▶ ${replies.length === 1 ? "View reply" : `View replies (${replies.length})`}`
                                }
                            </button>
                        )}

                        {replyBox === c.id && (
                            <input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Reply..."
                                style={inputStyle}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        addComment(c.id, replyText);
                                    }
                                }}
                            />
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

            {renderComments()}

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