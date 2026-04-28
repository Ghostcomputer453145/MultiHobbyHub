import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Navbar() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
  const theme = themes[selectedTheme];
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div style={{ background: theme.color, padding: "10px" }}>
      
      <div style={topBar}>
        
        <h2 style={titleStyle}>{theme.name}</h2>

        <input placeholder="Search" style={searchStyle} />

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
};

const linkStyle = {
  margin: "10px",
  fontWeight: "bold",
  color: "gold",
  textDecoration: "none",
};

const logoutBtn = {
  marginLeft: "10px",
};

const selectStyle = {
  padding: "10px",
};