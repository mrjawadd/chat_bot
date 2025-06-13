const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const GROQ_API_KEY = "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"; // Replace this
const MODEL = "llama3-8b-8192";

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/chat", async (req, res) => {
  const userInput = req.body.question;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userInput }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Groq API Error:", data);
      return res.json({ reply: "❌ Groq API error. Check your key or model." });
    }

    const botReply = data.choices[0]?.message?.content || "🤖 No reply received.";
    res.json({ reply: botReply });

  } catch (error) {
    console.error("Fetch error:", error);
    res.json({ reply: "⚠️ Error talking to Groq API." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});