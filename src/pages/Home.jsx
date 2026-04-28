import { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient";
import PostCard from "../components/PostCard";
import { ThemeContext } from "../context/ThemeContext";

export default function Home() {
    const { selectedTheme } = useContext(ThemeContext);
    const [posts, setPosts] = useState([]);
    const [orderBy, setOrderBy] = useState("created_at");

    useEffect(() => {
        fetchPosts();
    }, [orderBy, selectedTheme]);

    const fetchPosts = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .eq("category", selectedTheme)
            .order(orderBy, { ascending: false });

        setPosts(data || []);
    };

    return (
        <div style={container}>
            <div style={orderBox}>
                <p><b>Order by:</b></p>
                <button onClick={() => setOrderBy("created_at")}>Newest</button>
                <button onClick={() => setOrderBy("upvotes")}>Most Popular</button>
            </div>

            <div>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

const container = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const orderBox = {
    marginTop: "20px",
    marginBottom: "20px",
};