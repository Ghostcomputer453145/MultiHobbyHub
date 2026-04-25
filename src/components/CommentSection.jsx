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
        await supabase.from("comments").insert([
            { post_id: postId, content: text }
        ]);

        setText("");
        fetchComments();
    };

    return (
        <div>
            <h3>Comments</h3>

            {comments.map((c) => (
                <p key={c.id}>{c.content}</p>
            ))}

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write comment"
            />
            <button onClick={addComment}>Add</button>
        </div>
    );
}