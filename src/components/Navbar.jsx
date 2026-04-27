import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
  const theme = themes[selectedTheme];

  return (
    <div style={{ background: theme.color, padding: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={textStyle}>{theme.name}</h2>

        <input
          placeholder="Search post"
          style={{ padding: "8px", width: "300px" }}
        />

        <div>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/create" style={linkStyle}>Create New Post</Link>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <select onChange={(e) => setSelectedTheme(e.target.value)}>
          {Object.keys(themes).map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

const textStyle = {
  color: "gold",
  fontSize: "24px",
  fontWeight: "bold",
  textShadow: "2px 2px 0 black",
};

const linkStyle = {
  margin: "10px",
  fontSize: "22px",
  fontWeight: "bold",
  color: "gold",
  textShadow: "2px 2px 0 black",
  textDecoration: "none",
};