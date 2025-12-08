import { sendResponse } from '../../../utils/response';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return sendResponse(res, { message: 'Invalid image URL provided.' }, 400);
    }

    // In a real application, you would save the image URL to a database
    return sendResponse(res, { message: `Profile picture updated to ${imageUrl.trim()}!`, imageUrl: imageUrl.trim() }, 201);
  } else if (req.method === 'GET') {
    // In a real application, you would fetch the profile picture URL from a database
    return sendResponse(res, { imageUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=128' });
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}