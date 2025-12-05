import { sendResponse } from '../../utils/response';

export default function handler(req, res) {
  const joke = "Why do Java developers wear glasses? Because they don't C#.";
  return sendResponse(res, { joke: joke });
}
