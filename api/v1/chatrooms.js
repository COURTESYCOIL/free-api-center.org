
import { sendResponse } from '../../utils/response';

const chatrooms = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return sendResponse(res, { message: 'Chatroom name is required.' }, 400);
    }
    const newChatroom = {
      id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Custom unique ID
      name: name.trim(),
      messages: [],
      users: []
    };
    chatrooms.push(newChatroom);
    return sendResponse(res, { message: 'Chatroom created successfully!', data: newChatroom }, 201);
  } else if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const chatroom = chatrooms.find(c => c.id === id);
      if (!chatroom) {
        return sendResponse(res, { message: 'Chatroom not found.' }, 404);
      }
      return sendResponse(res, { data: chatroom });
    }
    return sendResponse(res, { data: chatrooms });
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}
