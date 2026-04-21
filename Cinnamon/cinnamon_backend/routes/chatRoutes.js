const express = require('express');
const axios = require('axios');

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ error: 'Please enter a question.' });
    }

    const systemMessage = `
      You are the "Cinnamon Bridge AI Expert". Your knowledge is STRICTLY limited to Cinnamon and the Cinnamon Bridge project.
      
      STRICT RULES:
      1. If the user asks about cinnamon (types, grades like Alba/C5/H1, benefits, history, or cooking), provide a detailed and expert answer.
      2. If the user asks about ANYTHING ELSE (e.g., other countries, general politics, sports, other foods, or general knowledge), you MUST politely refuse.
      3. Do NOT provide lists, suggestions, or "brief helpful answers" for non-cinnamon topics.
      4. Your response for non-cinnamon topics should be exactly like this: "I am sorry, but I am a specialized Cinnamon Assistant. I can only provide information related to Cinnamon and its industry. Please ask me anything about Cinnamon!"
      5. You can answer in English or Sinhala based on the user's language.
    `;

    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant', 
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: question } 
        ],
        temperature: 0.6, 
        max_tokens: 500  
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const answer = groqRes.data.choices?.[0]?.message?.content || 'Answer not found.';

    res.json({ answer });

  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    res.status(500).json({
      answer: '❗ The Cloud AI system is not responding at this time. Please try again.'
    });
  }
});

module.exports = router;