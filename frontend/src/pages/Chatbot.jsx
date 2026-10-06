import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!prompt.trim()) {
            alert("Please enter a message");
            return;
        }

        const url = `http://localhost:8000/chat/${encodeURIComponent(prompt)}`;

        try {
            setLoading(true);

            const result = await axios.get(url);

            console.log(result.data);

            setResponse(result.data);
        } catch (error) {
            console.error("Error fetching response:", error);
            alert("Error fetching response. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    backgroundColor: "white",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "20px",
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "24px" }}>
                        🤖 AI Chatbot
                    </h1>

                    <p
                        style={{
                            margin: "6px 0 0",
                            fontSize: "14px",
                            opacity: 0.9,
                        }}
                    >
                        FastAPI + Groq + Redis Cache
                    </p>
                </div>

                {/* Chat Area */}
                <div
                    style={{
                        minHeight: "350px",
                        padding: "25px",
                        backgroundColor: "#f9fafb",
                    }}
                >
                    {!response && !loading && (
                        <div
                            style={{
                                textAlign: "center",
                                color: "#6b7280",
                                marginTop: "100px",
                            }}
                        >
                            <div style={{ fontSize: "45px" }}>💬</div>

                            <h2>Ask me anything</h2>

                            <p>
                                Enter your question below to get an AI response.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "100px",
                                color: "#2563eb",
                            }}
                        >
                            <h3>🤔 AI is thinking...</h3>
                            <p>Please wait...</p>
                        </div>
                    )}

                    {response && !loading && (
                        <div>
                            {/* User Question */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#2563eb",
                                        color: "white",
                                        padding: "12px 16px",
                                        borderRadius: "15px 15px 0 15px",
                                        maxWidth: "70%",
                                    }}
                                >
                                    {prompt}
                                </div>
                            </div>

                            {/* AI Response */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        padding: "18px",
                                        borderRadius: "15px 15px 15px 0",
                                        maxWidth: "80%",
                                        boxShadow:
                                            "0 2px 5px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    {/* Source */}
                                    <div
                                        style={{
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                padding: "5px 10px",
                                                borderRadius: "20px",
                                                backgroundColor:
                                                    response.source === "redis"
                                                        ? "#dcfce7"
                                                        : "#dbeafe",
                                                color:
                                                    response.source === "redis"
                                                        ? "#166534"
                                                        : "#1d4ed8",
                                            }}
                                        >
                                            {response.source === "redis"
                                                ? "⚡ Redis Cache"
                                                : "🤖 Groq LLM"}
                                        </span>
                                    </div>

                                    {/* AI Answer */}
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "1.6",
                                            color: "#374151",
                                        }}
                                    >
                                        {response.data}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div
                    style={{
                        padding: "20px",
                        borderTop: "1px solid #e5e7eb",
                        backgroundColor: "white",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSend();
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: "13px 15px",
                                border: "1px solid #d1d5db",
                                borderRadius: "10px",
                                outline: "none",
                                fontSize: "15px",
                            }}
                        />

                        <button
                            onClick={handleSend}
                            disabled={loading}
                            style={{
                                padding: "12px 22px",
                                border: "none",
                                borderRadius: "10px",
                                backgroundColor: loading
                                    ? "#9ca3af"
                                    : "#2563eb",
                                color: "white",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize: "15px",
                                fontWeight: "bold",
                            }}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                        
                    </div>
                </div>
                                
            </div>
            <p></p>
        </div>
    );
}

export default Chatbot;