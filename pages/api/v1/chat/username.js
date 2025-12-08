import { sendResponse } from '../../../utils/response';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || username.trim() === '') {
      return sendResponse(res, { message: 'Invalid username provided.' }, 400);
    }

    // In a real application, you would save the username to a database
    return sendResponse(res, { message: `Username updated to ${username.trim()}!`, username: username.trim() }, 201);
  } else if (req.method === 'GET') {
    // In a real application, you would fetch the username from a database
    return sendResponse(res, { username: 'GuestUser' });
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}