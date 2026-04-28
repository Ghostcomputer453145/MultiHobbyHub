import { Link } from "react-router-dom";

export default function PostCard({ post }) {
    const timeAgo = getTimeAgo(post.created_at);

    return (
        <Link to={`/post/${post.id}`} style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
                <p>Posted {timeAgo}</p>
                <h2 style={titleStyle}>{post.title}</h2>
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
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 29030400) return `${Math.floor(diff / 2419200)} months ago`;
    if (diff < 290304000) return `${Math.floor(diff / 29030400)} years ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

const cardStyle = {
    background: "white",
    margin: "20px",
    padding: "30px",
    borderRadius: "15px",
    width: "1000px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
    color: "black"
};

const titleStyle = {
    color: "black",
    fontSize: "26px",
    fontWeight: "bold"
};