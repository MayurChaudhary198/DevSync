const axios = require("axios");

const generateAISummary = async (req, res) => {
  const { tasks } = req.body;

  if (!tasks || tasks.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No tasks provided for summary.",
    });
  }

  const formattedTasks = tasks
    .map(
      (task, index) =>
        `${index + 1}. Title: ${task.title}, Status: ${task.status}, Description: ${task.description || "No description"}`
    )
    .join("\n");

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You're an assistant helping summarize project progress. Summarize clearly and professionally.",
          },
          {
            role: "user",
            content: `Here are the project tasks:\n\n${formattedTasks}\n\nGive a brief summary of current progress, key completed and pending tasks.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (err) {
    console.error("❌ AI Summary Error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI summary",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = { generateAISummary };