import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (!error) {
      alert("Password updated!");
      navigate("/");
    } else {
      alert("Error updating password");
    }
  };

  return (
    <div style={container}>
      <h1>Update Password</h1>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={updatePassword} style={btn}>
        Update Password
      </button>
    </div>
  );
}


const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "100px",
  gap: "10px"
};

const input = {
  padding: "10px",
  width: "250px"
};

const btn = {
  padding: "10px 20px",
  fontWeight: "bold"
};