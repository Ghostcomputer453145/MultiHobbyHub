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
import UpdatePassword from "./pages/UpdatePassword";

function App() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route path="/*" element={
          !selectedTheme ? (
            <div style={bgStyle}>
              <h1 style={titleStyle}>HobbyHub</h1>
              <p style={goldText}>Name: Yumin Jang</p>
              <p style={goldText}>Z Number: Z23655899</p>

              {!user ? (
                <div style={{ display: "flex", gap: "20px" }}>
                  <button onClick={() => window.location.href = "/login"} style={btnStyle}>
                    Login
                  </button>
                  <button onClick={() => window.location.href = "/signup"} style={btnStyle}>
                    Sign Up
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={goldText}>Please select a Hobby Topic</h2>

                  <select
                    style={selectStyle}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                  >
                    <option>Select a Hobby</option>
                    {Object.keys(themes).map((key) => (
                      <option key={key}>{key}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          ) : (
            <MainApp />
          )
        } />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  const { selectedTheme, themes } = useContext(ThemeContext);
  const theme = themes[selectedTheme];

  return (
    <div
      style={{
        backgroundImage: `url(${theme.bg})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
}

const bgStyle = {
  backgroundImage: "url('/images/hobby.png')",
  backgroundSize: "cover",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
};

const titleStyle = {
  color: "gold",
  fontSize: "72px",
  fontWeight: "bold",
  textShadow: "4px 4px 0 black",
};

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

const selectStyle = {
  padding: "12px",
  fontSize: "18px",
};

export default App;