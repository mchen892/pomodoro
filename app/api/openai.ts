import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  } catch (error: any) {
    console.error('Error with OpenAI API:', error.message); // Print error message to console
    console.error('Error details:', error); // Print detailed error object for debugging

    // Check if error has a response from OpenAI API
    if (error.response) {
      console.error('Response data:', error.response.data); // Print the response data from OpenAI
    }

    return res.status(500).json({ message: 'Failed to fetch AI response' });
  }
}
