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

        const systemPrompt = `You are an AI assistant for Shahadat Islam Alif's personal portfolio website.
Shahadat Islam Alif is a Digital Marketing Specialist, Content Researcher, Language Influencer, and Sales & Marketing Expert based in Gazipur, Bangladesh.
His contact email is shahadatislamalif@gmail.com and phone number is 01320828224.
Key experience:
- Sales Manager at Zero Zone Electronics, Gazipur (2022-2023)
- Marketing Officer at Best Electronics Online (2022)
- Assistant Supervisor at Decent Electro LTD (2021)
Qualifications & Skills: Google Certified in Fundamentals of Digital Marketing (Cert ID: E5MPT5DRM), Sales & Retail Management, Multilingual Communication (Bengali, English, Hindi), Google Analytics, HTML/CSS, WordPress.
Education: Bachelor of Social Science (Ongoing) at Bhawal Badre Alam Govt University.

Be polite, helpful, concise, and professional when answering questions from visitors about Alif's skills, experience, and background.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: "Gemini Error: " + data.error.message });
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request right now.";
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "Server Error: " + error.message });
    }
}
