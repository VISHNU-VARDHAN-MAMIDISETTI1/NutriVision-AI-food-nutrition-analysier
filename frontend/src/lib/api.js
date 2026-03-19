const API_BASE = typeof window !== 'undefined' ? `http://${window.location.hostname}:8000/api` : "http://localhost:8000/api";

export const analyzeFoodImage = async (inputParams) => {
    const formData = new FormData();
    if (inputParams.file) {
        formData.append("image", inputParams.file);
    } else if (inputParams.text) {
        formData.append("text", inputParams.text);
    }

    try {
        const res = await fetch(`${API_BASE}/analyze-food`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            const errRes = await res.json();
            throw new Error(errRes.error || "Analysis failed");
        }
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const chatWithAI = async (message, contextName = "") => {
    try {
        const res = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message, context: contextName }),
        });
        if (!res.ok) {
            const errRes = await res.json();
            throw new Error(errRes.error || "Chat failed");
        }
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};
