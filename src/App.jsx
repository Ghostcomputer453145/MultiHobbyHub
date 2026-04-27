import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { supabase } from "./utils/supabaseClient";

function App() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
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
                  }}
                >
                  HobbyHub
                </h1>

                <p style={goldText}>Name: Yumin Jang</p>
                <p style={goldText}>Z Number: Z23655899</p>

                <div style={{ display: "flex", gap: "20px" }}>
                  <a href="/login">
                    <button style={btnStyle}>Login</button>
                  </a>
                  <a href="/signup">
                    <button style={btnStyle}>Sign Up</button>
                  </a>
                </div>
              </div>
            }
          />

          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    );
  }

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
        <h1 style={goldText}>Select a Hobby</h1>

        <select
          style={{ padding: "10px", fontSize: "18px" }}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          <option>Select a Hobby</option>
          {Object.keys(themes).map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </div>
    );
  }

  const theme = themes[selectedTheme];

  return (
    <div
      style={{
        backgroundImage: `url(${theme.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </Router>
    </div>
  );
}

const goldText = {
  color: "gold",
  fontSize: "24px",
  fontWeight: "bold",
  textShadow: "3px 3px 0 black",
};

const btnStyle = {
  fontSize: "20px",
  padding: "12px 24px",
  fontWeight: "bold",
};

export default App;