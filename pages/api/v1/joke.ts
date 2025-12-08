import { NextApiRequest, NextApiResponse } from 'next';
import { sendResponse } from '../../../utils/response';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const jokes: string[] = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "There are 10 types of people in this world, those who understand binary and those who don't.",
      "Debugging: Removing the needles from the haystack, only to realize it was a sewing machine all along.",
      "My code doesn't have bugs, it has random features.",
      "Why do Java developers wear glasses? Because they don't C#."
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    sendResponse(res, { joke: randomJoke });
  } else {
    sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}