export default function LoadingSpinner() {
    return (
        <div style={wrapper}>
            <div style={spinner}></div>
            <p style={{ marginTop: "10px" }}>Loading...</p>
        </div>
    );
}

const wrapper = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
};

const spinner = {
    width: "50px",
    height: "50px",
    border: "6px solid #ccc",
    borderTop: "6px solid #87CEFA",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
};