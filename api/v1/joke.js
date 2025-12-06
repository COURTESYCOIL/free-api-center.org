import { sendResponse } from '../../utils/response';

export default function handler(req, res) {
  const jokes = [
    "Why do Java developers wear glasses? Because they don't C#.",
    "There are 10 types of people in this world, those who understand binary and those who don't.",
    "Debugging: Removing the needles from the haystack, only to realize it was a sewing machine all along.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "My code doesn't have bugs, it has random features."
  ];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  return sendResponse(res, { joke: randomJoke });
}