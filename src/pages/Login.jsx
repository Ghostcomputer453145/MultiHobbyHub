import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const login = async (e) => {
        e.preventDefault(); 

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return;
        }

        if (data.user) {
            setUser(data.user);
            navigate("/");
        }
    };

    const resetPassword = async () => {
        if (!email) {
            alert("Enter your email first");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/update-password",
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Password reset email sent");
        }
    };

    return (
        <form onSubmit={login} style={container}>
            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
            />

            <button type="submit" style={btn}>Login</button>

            <p onClick={resetPassword} style={forgot}>
                Forgot Password?
            </p>
        </form>
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

const forgot = {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline"
};