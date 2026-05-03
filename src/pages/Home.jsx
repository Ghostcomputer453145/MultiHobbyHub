import { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabaseClient";
import PostCard from "../components/PostCard";
import { ThemeContext } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
    const { selectedTheme } = useContext(ThemeContext);
    const [posts, setPosts] = useState([]);
    const [orderBy, setOrderBy] = useState("created_at_desc");
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";
    const [flagFilter, setFlagFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [orderBy, selectedTheme, search, flagFilter]);

    const fetchPosts = async () => {
        setLoading(true);

        let query = supabase
            .from("posts")
            .select("*")
            .eq("category", selectedTheme);

        if (search) {
            query = query.ilike("title", `%${search}%`);
        }

        if (flagFilter) {
            query = query.eq("flag", flagFilter);
        }

        let column = "created_at";
        let ascending = false;

        switch (orderBy) {
            case "created_at_asc":
                ascending = true;
                break;
            case "upvotes_desc":
                column = "upvotes";
                break;
            case "upvotes_asc":
                column = "upvotes";
                ascending = true;
                break;
            case "title_asc":
                column = "title";
                ascending = true;
                break;
            case "title_desc":
                column = "title";
                break;
        }

        const { data } = await query.order(column, { ascending });

        setPosts(data || []);
        setLoading(false);
    };

    return (
        <div style={container}>
            <div style={orderBox}>
                <p style={orderText}>Order by:</p>

                <div style={buttonRow}>
                    <button style={fancyBtn} onClick={() => setOrderBy("created_at_desc")}>Newest</button>
                    <button style={fancyBtn} onClick={() => setOrderBy("created_at_asc")}>Oldest</button>
                    <button style={fancyBtn} onClick={() => setOrderBy("upvotes_desc")}>Most Popular</button>
                    <button style={fancyBtn} onClick={() => setOrderBy("upvotes_asc")}>Least Popular</button>
                    <button style={fancyBtn} onClick={() => setOrderBy("title_asc")}>A-Z</button>
                    <button style={fancyBtn} onClick={() => setOrderBy("title_desc")}>Z-A</button>
                </div>
            </div>

            <select onChange={(e) => setFlagFilter(e.target.value)} style={fancyBtn}>
                <option value="">All</option>
                <option value="Question">Question</option>
                <option value="Opinion">Opinion</option>
            </select>

            {loading ? (
                <LoadingSpinner />
            ) : posts.length === 0 ? (
                <h2 style={noResults}>There're no results...</h2>
            ) : (
                <div>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}

const noResults = {
    color: "gold",
    fontWeight: "bold",
    fontSize: "36px",
    WebkitTextStroke: "2px black",
    marginTop: "40px"
};

const container = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const orderBox = {
    marginTop: "20px",
    marginBottom: "30px",
};

const orderText = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "gold",
    WebkitTextStroke: "1px black",
    marginBottom: "15px",
};

const buttonRow = {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
};

const fancyBtn = {
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "20px",
    padding: "10px 26px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    WebkitTextStroke: "1px black",
};