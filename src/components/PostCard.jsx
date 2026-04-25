import { Link } from "react-router-dom";

export default function PostCard({ post }) {
    return (
        <div className="card">
            <Link to={`/post/${post.id}`}>
                <h3>{post.title}</h3>
            </Link>
            <p>{new Date(post.created_at).toLocaleString()}</p>
            <p>Upvotes: {post.upvotes}</p>
        </div>
    );
}