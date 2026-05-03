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

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) alert(error.message);
    };

    const resetPassword = async () => {
        if (!email) {
            alert("Enter your email first");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/update-password",
        });

        if (error) alert(error.message);
        else alert("Password reset email sent");
    };

    return (
        <form onSubmit={login} style={container}>
            <h1 style={title}>Login</h1>

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

            <button type="submit" style={fancyBtn}> Login </button>
            <button type="button" onClick={loginWithGoogle} style={{ ...fancyBtn, marginTop: "5px" }} > Continue with Google </button>
            <p style={text}> Don't have an account? </p>
            <button type="button" onClick={() => navigate("/signup")} style={{ ...fancyBtn, marginTop: "5px" }} > Sign Up! </button>
            <button type="button" onClick={resetPassword} style={{ ...fancyBtn, marginTop: "10px" }}> Forgot Password? </button>
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

const title = {
    color: "gold",
    WebkitTextStroke: "1px black",
    fontSize: "40px",
    marginBottom: "10px"
};

const text = {
    color: "gold",
    fontWeight: "bold",
    WebkitTextStroke: "1px magenta",
    fontSize: "30px",
    marginTop: "20px",
    marginBottom: "10px"
};

const input = {
    padding: "10px",
    width: "250px"
};

const fancyBtn = {
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "20px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "20px",
    WebkitTextStroke: "1px black",
};