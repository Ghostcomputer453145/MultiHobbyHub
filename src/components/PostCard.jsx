import { Link } from "react-router-dom";

export default function PostCard({ post }) {
    const timeAgo = getTimeAgo(post.created_at);

    return (
        <Link to={`/post/${post.id}`} style={{ textDecoration: "none", color: "black" }}>
            <div style={cardStyle}>
                <p>
                    Posted: {new Date(post.created_at).toLocaleString()} ({timeAgo})
                </p>

                <h2 style={{ fontWeight: "bold" }}>{post.title}</h2>

                <p>{post.upvotes} upvotes</p>
            </div>
        </Link>
    );
}

function getTimeAgo(date) {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

const cardStyle = {
    background: "white",
    margin: "20px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
};