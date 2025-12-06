import { sendResponse } from '../../utils/response';

const jokes = [
  "Why do Java developers wear glasses? Because they don't C#.",
  "There are 10 types of people in this world, those who understand binary and those who don't.",
  "Debugging: Removing the needles from the haystack, only to realize it was a sewing machine all along.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "My code doesn't have bugs, it has random features."
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { joke } = req.body;

    if (!joke || typeof joke !== 'string' || joke.trim() === '') {
      return sendResponse(res, { message: 'Invalid joke provided.' }, 400);
    }

    jokes.push(joke.trim());
    return sendResponse(res, { message: 'Joke added successfully!', joke: joke.trim() }, 201);
  } else if (req.method === 'GET') {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return sendResponse(res, { joke: randomJoke });
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}