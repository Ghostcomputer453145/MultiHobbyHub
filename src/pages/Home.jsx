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
                <p style={orderText}>Order by:</p>
                <div style={{ display: "flex", gap: "15px" }}>
                    <button style={fancyBtn} onClick={() => setOrderBy("created_at")}>
                        Newest
                    </button>
                    <button style={fancyBtn} onClick={() => setOrderBy("upvotes")}>
                        Most Popular
                    </button>
                </div>
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

const orderText = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "gold",
    textShadow: "3px 3px 0 black",
};

const fancyBtn = {
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    textShadow: "2px 2px 0 black",
};