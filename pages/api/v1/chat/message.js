import { sendResponse } from '../../../utils/response';

const messages = [
  { id: 1, username: 'Alice', message: 'Hello everyone!', timestamp: new Date().toISOString() },
  { id: 2, username: 'Bob', message: 'Hi Alice!', timestamp: new Date().toISOString() },
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, message } = req.body;

    if (!username || typeof username !== 'string' || username.trim() === '') {
      return sendResponse(res, { message: 'Invalid username provided.' }, 400);
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return sendResponse(res, { message: 'Invalid message provided.' }, 400);
    }

    const newMessage = {
      id: messages.length + 1,
      username: username.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    return sendResponse(res, { message: 'Message sent successfully!', message: newMessage }, 201);
  } else if (req.method === 'GET') {
    return sendResponse(res, { messages });
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}