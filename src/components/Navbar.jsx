import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

export default function Navbar() {
  const { selectedTheme, setSelectedTheme, themes } = useContext(ThemeContext);
  const theme = themes[selectedTheme];
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div style={{ background: theme.color, padding: "10px" }}>
      <div style={topBar}>
        <h2 style={titleStyle}>{theme.name}</h2>

        <input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            navigate(`/?search=${e.target.value}`);
          }}
          style={searchStyle}
        />

        <div style={rightBar}>
          <Link to="/" style={navBtn}>Home</Link>
          <Link to="/create" style={navBtn}>Create New Post</Link>

          <div ref={menuRef} style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(!showMenu)} style={profileBtn}>
              👤 {user?.user_metadata?.username || "User"}
            </button>

            {showMenu && (
              <div style={menuBox}>
                <p><b>Username:</b> {user?.user_metadata?.username}</p>
                <p>
                  <b>Name:</b>{" "}
                  {user?.user_metadata?.first_name}{" "}
                  {user?.user_metadata?.last_name}
                </p>
                <p><b>Email:</b> {user?.email}</p>

                <button onClick={handleLogout} style={logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
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

const rightBar = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  justifyContent: "flex-end",
};

const titleStyle = { color: "gold", fontWeight: "bold" };

const searchStyle = {
  padding: "10px",
  width: "300px",
  borderRadius: "20px",
  border: "2px solid black",
  justifySelf: "center",
  background: "white",
  color: "black",
};

const langInput = {
  padding: "6px",
  borderRadius: "5px",
  background: "white",
  color: "black",
  border: "2px solid black",
};

const dropdown = {
  position: "absolute",
  background: "white",
  color: "black",
  border: "1px solid black",
  width: "200px",
  maxHeight: "150px",
  overflowY: "auto",
  zIndex: 999,
};

const dropdownItem = {
  padding: "5px",
  cursor: "pointer",
};

const navBtn = {
  backgroundColor: "#87CEFA",
  color: "darkblue",
  border: "3px solid black",
  borderRadius: "15px",
  padding: "8px 12px",
  fontWeight: "bold",
  textDecoration: "none",
};

const profileBtn = {
  backgroundColor: "#87CEFA",
  color: "gold",
  border: "3px solid black",
  borderRadius: "15px",
  padding: "8px 12px",
  fontWeight: "bold",
};

const menuBox = {
  position: "absolute",
  right: 0,
  top: "40px",
  background: "white",
  color: "black",
  padding: "15px",
  borderRadius: "10px",
  width: "260px",
  zIndex: 9999,
};

const logoutBtn = {
  marginTop: "10px",
  backgroundColor: "#87CEFA",
  color: "gold",
  border: "3px solid black",
  borderRadius: "20px",
  padding: "8px 16px",
  fontWeight: "bold",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "20px",
  border: "2px solid black",
  backgroundColor: "white",
  color: "black",
};