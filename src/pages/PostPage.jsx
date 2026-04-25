import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import CommentSection from "../components/CommentSection";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        const { data } = await supabase.from("posts").select("*").eq("id", id).single();
        setPost(data);
    };

    const upvote = async () => {
        await supabase
            .from("posts")
            .update({ upvotes: post.upvotes + 1 })
            .eq("id", id);

        fetchPost();
    };

    const deletePost = async () => {
        await supabase.from("posts").delete().eq("id", id);
        navigate("/");
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.image_url && <img src={post.image_url} width="300" />}

            <button onClick={upvote}>Upvote ({post.upvotes})</button>
            <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
            <button onClick={deletePost}>Delete</button>

            <CommentSection postId={id} />
        </div>
    );
}