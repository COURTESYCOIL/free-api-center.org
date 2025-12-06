
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
    const pathSegments = req.url.split('/').filter(Boolean); // Split URL into segments and remove empty strings
    let chatroomIdFromPath = null;
    let isMessagesRequest = false;

    if (pathSegments.length >= 4 && pathSegments[2] === 'chatrooms') {
      chatroomIdFromPath = pathSegments[3];
      if (pathSegments.length >= 5 && pathSegments[4] === 'messages') {
        isMessagesRequest = true;
      }
    }

    const id = req.query.id || chatroomIdFromPath; // Prioritize query ID, then path ID

    if (id) {
      const chatroom = chatrooms.find(c => c.id === id);
      if (!chatroom) {
        return sendResponse(res, { message: 'Chatroom not found.' }, 404);
      }

      if (isMessagesRequest) {
        return sendResponse(res, { data: chatroom.messages });
      }
      return sendResponse(res, { data: chatroom });
    }
    return sendResponse(res, { data: chatrooms });
  } else if (req.method === 'POST') {
    const pathSegments = req.url.split('/').filter(Boolean);
    let chatroomIdFromPath = null;
    let isMessagesPost = false;

    if (pathSegments.length >= 4 && pathSegments[2] === 'chatrooms') {
      chatroomIdFromPath = pathSegments[3];
      if (pathSegments.length >= 5 && pathSegments[4] === 'messages') {
        isMessagesPost = true;
      }
    }

    const id = req.query.id || chatroomIdFromPath;

    if (id && isMessagesPost) {
      const chatroom = chatrooms.find(c => c.id === id);
      if (!chatroom) {
        return sendResponse(res, { message: 'Chatroom not found.' }, 404);
      }

      const { username, message } = req.body;
      if (!username || !message || typeof username !== 'string' || typeof message !== 'string' || username.trim() === '' || message.trim() === '') {
        return sendResponse(res, { message: 'Username and message are required.' }, 400);
      }

      const newMessage = {
        username: username.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      chatroom.messages.push(newMessage);
      return sendResponse(res, { message: 'Message sent successfully!', data: newMessage }, 201);
    }
    // If it's a POST but not for messages, it's for creating a chatroom (already handled above)
    // Or if it's a POST to /api/v1/chatrooms without an ID, it's also for creating a chatroom.
    // The existing POST for chatroom creation is at the top, so this else if will only catch
    // POST requests that are specifically for messages on an existing chatroom.
    // If it's a POST to /api/v1/chatrooms, it will be handled by the first if (req.method === 'POST')
    // So this block should only handle POST to /api/v1/chatrooms/:id/messages
    return sendResponse(res, { message: 'Method Not Allowed for this endpoint.' }, 405);
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}
