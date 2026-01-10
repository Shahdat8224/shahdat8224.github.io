export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = JSON.parse(req.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    // Direct fetch to Google with strict error handling
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // This will show us the EXACT Google error in the chat bubble
      return res.status(200).json({ reply: "Google says: " + data.error.message });
    }

    const aiReply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(200).json({ reply: "Connection Error: " + error.message });
  }
      }
                                   
