import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [orderBy, setOrderBy] = useState("created_at");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [orderBy]);

    const fetchPosts = async () => {
        setLoading(true);

        const { data } = await supabase
            .from("posts")
            .select("*")
            .order(orderBy, { ascending: false });

        setPosts(data || []);
        setLoading(false);
    };

    const filteredPosts = posts
        .filter((post) =>
            post.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((post) =>
            category === "all" ? true : post.category === category
        );

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Home Feed</h1>

            <input
                placeholder="Search posts..."
                onChange={(e) => setSearch(e.target.value)}
            />

            <br /><br />

            <select onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All</option>
                <option value="general">General</option>
                <option value="gaming">Gaming</option>
                <option value="sports">Sports</option>
                <option value="tech">Tech</option>
            </select>

            <br /><br />

            <button onClick={() => setOrderBy("created_at")}>
                Sort by Time
            </button>

            <button onClick={() => setOrderBy("upvotes")}>
                Sort by Upvotes
            </button>

            {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}