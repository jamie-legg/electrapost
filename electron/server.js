// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/ai-predictions', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        prompt: code,
        model: 'text-davinci-003',
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.json({ prediction: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error fetching AI prediction:', error);
    res.status(500).json({ error: 'Failed to fetch AI prediction' });
  }
});

app.listen(3050, () => {
  console.log('Server running on port 3050');
});
