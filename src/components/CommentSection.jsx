import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        const { data } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId);

        setComments(data);
    };

    const addComment = async () => {
        if (!text.trim()) return;

        await supabase.from("comments").insert([
            { post_id: postId, content: text }
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
        <div style={{ marginTop: "20px" }}>
            <h3 style={{ color: "black" }}>Comments</h3>

            {comments.map((c) => (
                <p key={c.id} style={{ color: "black" }}>{c.content}</p>
            ))}

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

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "20px",
    border: "2px solid black",
    backgroundColor: "white",
    color: "black"
};