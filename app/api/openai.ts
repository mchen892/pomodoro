// pages/api/openai.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAI } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ message: 'Prompt cannot be empty' });
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
    });

    const aiResult = response.data.choices[0]?.text || 'No response from AI';

    return res.status(200).json({ result: aiResult });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return res.status(500).json({ message: 'Failed to fetch AI response' });
  }
}
