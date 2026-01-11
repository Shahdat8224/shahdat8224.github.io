export default async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method not allowed" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ reply: "API Key missing in Vercel settings." });
    }

    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ reply: "No message provided." });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userMessage }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: "Gemini Error: " + data.error.message });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "Server Error: " + error.message });
    }
}
