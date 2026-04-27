import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const signup = async () => {
        if (password !== confirm) {
            alert("Passwords do not match");
            return;
        }

        await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        alert("Check your email to confirm your account");
    };

    return (
        <div>
            <h1>Username</h1>
            <input onChange={(e) => setUsername(e.target.value)} />

            <h1>Email</h1>
            <input onChange={(e) => setEmail(e.target.value)} />

            <h1>Password</h1>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />

            <h1>Confirm Password</h1>
            <input type="password" onChange={(e) => setConfirm(e.target.value)} />

            <button onClick={signup}>Sign Up</button>
        </div>
    );
}