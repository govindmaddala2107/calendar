import React, { useState, useEffect } from "react";

const ValidateForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState(""); // Add csrfToken state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                // Fetch the token directly from the response body
                const response = await fetch("https://127.0.0.1:8000/csrf/", {
                    credentials: "include",
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken); // Use the token from the JSON
            } catch (error) {
                console.error("Failed to fetch CSRF token:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("csrfToken being sent: ", csrfToken);

        const res = await fetch("https://127.0.0.1:8000/validate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken, // Use state token
            },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setMessage("✅ " + JSON.stringify(data));
        } else {
            const errorText = await res.text();
            setMessage("❌ Error: " + errorText);
        }
    };

    if (isLoading) {
        return <div>Loading form...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
            <p>{message}</p>
        </form>
    );
};

export default ValidateForm;
