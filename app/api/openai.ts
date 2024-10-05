// pages/api/openai.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is correctly set
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ message: 'Prompt cannot be empty' });
  }

  try {
    // Use the new OpenAI SDK for chat completion with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Specify the model
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }, // Send the prompt from the user
      ],
    });

    const aiResponse = completion.choices[0].message;

    return res.status(200).json({ result: aiResponse }); // Send the AI response back to the client
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return res.status(500).json({ message: 'Failed to fetch AI response' });
  }
}
