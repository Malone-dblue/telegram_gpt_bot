const express = require("express");
const { Telegraf } = require("telegraf");
const axios = require("axios");

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

app.use(bot.webhookCallback("/"));

bot.start((ctx) => ctx.reply("Bienvenue ! Pose-moi une question."));

bot.on("text", async (ctx) => {
  const question = ctx.message.text;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    ctx.reply(answer);
  } catch (error) {
    console.error("Erreur OpenAI :", error.response?.data || error.message);
    ctx.reply("Désolé, une erreur est survenue.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot en ligne sur le port ${PORT}`);
});

bot.launch();
