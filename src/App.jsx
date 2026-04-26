import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <p className="info">Name: Yumin Jang</p>
      <p className="info">Z Number: Z23655899</p>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;