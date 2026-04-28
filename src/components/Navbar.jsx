import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Navbar() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
  const theme = themes[selectedTheme];
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    navigate(`/?search=${value}`);
  };

  return (
    <div style={{ background: theme.color, padding: "10px" }}>
      <div style={topBar}>
        <h2 style={titleStyle}>{theme.name}</h2>

        <input
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
          style={searchStyle}
        />

        <div>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/create" style={linkStyle}>Create New Post</Link>
          <button onClick={handleLogout} style={logoutBtn}>
            Log Out
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <select
          style={selectStyle}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          {Object.keys(themes).map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

const topBar = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  alignItems: "center",
};

const titleStyle = {
  justifySelf: "start",
  color: "gold",
  fontWeight: "bold",
};

const searchStyle = {
  justifySelf: "center",
  padding: "10px",
  width: "300px",
  borderRadius: "20px",
  border: "2px solid black",
  backgroundColor: "white",
  color: "black"
};

const linkStyle = {
  margin: "10px",
  fontWeight: "bold",
  color: "gold",
  textDecoration: "none",
};

const logoutBtn = {
  backgroundColor: "#87CEFA",
  color: "gold",
  border: "3px solid black",
  borderRadius: "20px",
  padding: "8px 16px",
  fontWeight: "bold",
  WebkitTextStroke: "0.5px black",
  cursor: "pointer"
};

const selectStyle = {
  padding: "10px",
  borderRadius: "20px",
  border: "2px solid black",
  backgroundColor: "white",
  color: "black"
};