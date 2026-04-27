import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (data.user) {
            setUser(data.user);
        }
    };

    return (
        <div>
            <h1>Email or Username</h1>
            <input onChange={(e) => setEmail(e.target.value)} />

            <h1>Password</h1>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />

            <button onClick={login}>Login</button>
        </div>
    );
}