import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({});

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {
        const { data } = await supabase.from("posts").select("*").eq("id", id).single();
        setPost(data);
    };

    const updatePost = async () => {
        await supabase.from("posts").update(post).eq("id", id);
        navigate(`/post/${id}`);
    };

    return (
        <div>
            <input
                value={post.title || ""}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <textarea
                value={post.content || ""}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
            />

            <button onClick={updatePost}>Update</button>
        </div>
    );
}