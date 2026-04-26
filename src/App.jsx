import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";

function App() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);

  if (!selectedTheme) {
    return (
      <div
        style={{
          backgroundImage: "url('/images/hobby.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{
          color: "gold",
          fontSize: "64px",
          fontWeight: "bold",
          textShadow: "3px 3px 0 black"
        }}>
          HobbyHub
        </h1>

        <select onChange={(e) => setSelectedTheme(e.target.value)}>
          <option>Select a Hobby</option>
          {Object.keys(themes).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <br /><br />

        <a href="/auth">
          <button>Login / Signup</button>
        </a>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />

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