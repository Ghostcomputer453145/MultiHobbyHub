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
          gap: "20px",
        }}
      >
        <h1
          style={{
            color: "gold",
            fontSize: "72px",
            fontWeight: "bold",
            textShadow: "4px 4px 0 black",
            marginBottom: "10px",
          }}
        >
          HobbyHub
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "gold",
              fontSize: "22px",
              fontWeight: "bold",
              textShadow: "2px 2px 0 black",
            }}
          >
            Name: Yumin Jang
          </p>

          <p
            style={{
              color: "gold",
              fontSize: "22px",
              fontWeight: "bold",
              textShadow: "2px 2px 0 black",
            }}
          >
            Z Number: Z23655899
          </p>
        </div>

        <select
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          <option>Select a Hobby</option>
          {Object.keys(themes).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <a href="/auth">
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>
            Login / Signup
          </button>
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