export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured in Vercel." });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: "No message provided." });
    }

    const systemPrompt = `You are Alif's AI Guide, an AI assistant representing Shahadat Islam Alif on his portfolio website.
Profile & Background:
- Name: Shahadat Islam Alif, based in Gazipur, Bangladesh.
- Professional Background: Digital marketing, multilingual communication (Bengali, English, Hindi), sales leadership, and tech enthusiast.
- Experience: Sales Manager at Zero Zone Electronics (2022–2023), Marketing Officer at Best Electronics Online (2022), Assistant Supervisor at Decent Electro LTD (2021).
- Certifications: Google Certified - Fundamentals of Digital Marketing (ID: E5MPT5DRM).
- Education: Bachelor of Social Science (Ongoing at Bhawal Badre Alam Govt. College).
- Contact Info: Email: shahadatislamalif@gmail.com | Phone: 01320828224.

Prompt Rule: Answer questions about Alif based on the above profile. For general knowledge or technical questions, answer normally and helpfully. Keep responses brief and conversational (under 3–4 sentences).`;

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || "Error calling Gemini API";
      return res.status(500).json({ error: errorMessage });
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      return res.status(500).json({ error: "No reply received from Gemini AI." });
    }

    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error." });
  }
}
