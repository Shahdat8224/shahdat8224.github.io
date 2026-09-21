export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured.' });
    }

    try {
        const { message } = req.body || {};

        if (!message) {
            return res.status(400).json({ error: 'No message provided.' });
        }

        const systemInstructionText = `
You are the AI Assistant for Shahadat Islam Alif's portfolio website. Answer questions based on Alif's profile below, or answer general questions helpfully like Gemini.
Keep all answers concise and under 3-4 sentences so they fit nicely in a chat widget.

Profile Details:
- Name: Shahadat Islam Alif, based in Gazipur, Bangladesh.
- Focus: Digital Marketing Specialist, Multilingual Communicator (Bengali, English, Hindi), Sales & Tech.
- Experience:
  * Sales Manager at Zero Zone Electronics (2022–2023)
  * Marketing Officer at Best Electronics Online (2022)
  * Assistant Supervisor at Decent Electro LTD (2021)
- Certifications: Google Certified - Fundamentals of Digital Marketing (Credential ID: E5MPT5DRM).
- Education: Bachelor of Social Science (Ongoing at Bhawal Badre Alam Govt. College).
- Contact: Email: shahadatislamalif@gmail.com | Phone: 01320828224.
`.trim();

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstructionText }]
                },
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message || 'Gemini API Error' });
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ error: 'Server Error: ' + error.message });
    }
}
