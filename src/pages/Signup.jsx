import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        first: "", last: "", username: "",
        email: "", password: "", confirm: ""
    });

    const signup = async () => {
        if (Object.values(form).some(v => !v)) {
            alert("Fill all fields");
            return;
        }

        if (form.password !== form.confirm) {
            alert("Passwords do not match");
            return;
        }

        await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    username: form.username,
                    first_name: form.first,
                    last_name: form.last
                }
            }
        });

        alert("Check email!");
        nav("/login");
    };

    return (
        <div style={wrap}>
            <div style={grid}>
                <div style={field}>
                    <label style={labelStyle}>First Name</label>
                    <input style={inputStyle} onChange={e => setForm({ ...form, first: e.target.value })} />
                </div>

                <div style={field}>
                    <label style={labelStyle}>Last Name</label>
                    <input style={inputStyle} onChange={e => setForm({ ...form, last: e.target.value })} />
                </div>

                <div style={field}>
                    <label style={labelStyle}>Username</label>
                    <input style={inputStyle} onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>

                <div style={field}>
                    <label style={labelStyle}>Email</label>
                    <input style={inputStyle} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>

                <div style={field}>
                    <label style={labelStyle}>Password</label>
                    <input type="password" style={inputStyle} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>

                <div style={field}>
                    <label style={labelStyle}>Confirm Password</label>
                    <input type="password" style={inputStyle} onChange={e => setForm({ ...form, confirm: e.target.value })} />
                </div>
            </div>

            <button style={fancyBtn} onClick={signup}> Sign Up! </button>
            <p style={loginText}> Already have an account? </p>
            <button style={{ ...fancyBtn, marginTop: "10px" }} onClick={() => nav("/login")} > Log In! </button>
        </div>
    );
}

const wrap = { padding: 20 };

const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    alignItems: "center"
};

const field = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const labelStyle = {
    fontSize: "50px",
    fontWeight: "bold",
    color: "gold",
    WebkitTextStroke: "2px black"
};

const inputStyle = {
    padding: "18px",
    fontSize: "20px",
    borderRadius: "12px",
    border: "3px solid black",
    width: "100%",
    boxSizing: "border-box"
};

const fancyBtn = {
    backgroundColor: "#87CEFA",
    color: "gold",
    border: "3px solid black",
    borderRadius: "20px",
    padding: "12px 24px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "22px",
    WebkitTextStroke: "1px black",
    marginTop: "15px"
};

const loginText = {
    color: "gold",
    fontWeight: "bold",
    WebkitTextStroke: "2px magenta",
    fontSize: "36px",
    marginTop: "25px",
    marginBottom: "15px"
};