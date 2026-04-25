import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [orderBy, setOrderBy] = useState("created_at");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPosts();
    }, [orderBy]);

    const fetchPosts = async () => {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .order(orderBy, { ascending: false });

        setPosts(data);
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Home Feed</h1>

            <input
                placeholder="Search posts..."
                onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={() => setOrderBy("created_at")}>Sort by Time</button>
            <button onClick={() => setOrderBy("upvotes")}>Sort by Upvotes</button>

            {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}