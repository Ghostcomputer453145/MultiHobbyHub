import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    await supabase.auth.signUp({ email, password });
    alert("Check email to confirm!");
  };

  const login = async () => {
    await supabase.auth.signInWithPassword({ email, password });
    alert("Logged in!");
  };

  return (
    <div>
      <h2>Login / Signup</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}