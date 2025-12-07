
import { sendResponse } from '../../utils/response';

// GitHub API Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // IMPORTANT: Set this environment variable securely
const GITHUB_OWNER = 'COURTESYCOIL'; // Your GitHub username
const GITHUB_REPO = 'free-api-center.org'; // Your repository name
const CHATROOMS_DIR = 'Chatrooms'; // Folder where chatroom files are stored
const GITHUB_API_BASE_URL = 'https://api.github.com';

// Helper function to make authenticated GitHub API requests
async function githubApiRequest(url, method = 'GET', data = null) {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub Token not configured.');
  }

  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
  };

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorBody.message}`);
  }
  return response.json();
}

// Helper to get file content from GitHub
async function getGitHubFile(filePath) {
  const url = `${GITHUB_API_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  try {
    const data = await githubApiRequest(url);
    // Content is Base64 encoded
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content: JSON.parse(content), sha: data.sha };
  } catch (error) {
    if (error.message.includes('Not Found')) {
      return null; // File not found
    }
    throw error;
  }
}

// Helper to create a file on GitHub
async function createGitHubFile(filePath, content, message) {
  const url = `${GITHUB_API_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  const encodedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
  return githubApiRequest(url, 'PUT', {
    message,
    content: encodedContent,
  });
}

// Helper to update a file on GitHub
async function updateGitHubFile(filePath, content, message, sha) {
  const url = `${GITHUB_API_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  const encodedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
  return githubApiRequest(url, 'PUT', {
    message,
    content: encodedContent,
    sha,
  });
}

// Helper to get directory contents from GitHub
async function getGitHubDirectoryContents(path) {
  const url = `${GITHUB_API_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  return githubApiRequest(url);
}

export default async function handler(req, res) {
  // Existing in-memory chatrooms array is no longer needed
  // const chatrooms = [];

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return sendResponse(res, { message: 'Chatroom name is required.' }, 400);
    }

    const newChatroom = {
      id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      messages: [],
      users: [],
    };

    const filePath = `${CHATROOMS_DIR}/${newChatroom.id}.json`;
    try {
      // Create chatroom UI folder and index.html (from Dev template)
      const devTemplateContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Chatroom</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .chat-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: 0 auto;
        }
        #messages {
            border: 1px solid #ddd;
            padding: 10px;
            height: 300px;
            overflow-y: scroll;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .message {
            margin-bottom: 8px;
        }
        .message strong {
            color: #007bff;
        }
        #message-input {
            width: calc(100% - 90px);
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
        }
        #send-button {
            padding: 8px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #send-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h1 id="chatroom-title">Loading Chatroom...</h1>
        <div id="messages"></div>
        <input type="text" id="message-input" placeholder="Type your message...">
        <button id="send-button">Send</button>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const messagesDiv = document.getElementById('messages');
            const messageInput = document.getElementById('message-input');
            const sendButton = document.getElementById('send-button');
            const chatroomTitle = document.getElementById('chatroom-title');
            const pageTitle = document.querySelector('title');

            const urlParams = new URLSearchParams(window.location.search);
            const chatroomId = urlParams.get('id');

            if (!chatroomId) {
                chatroomTitle.textContent = 'Error: Chatroom ID not provided.';
                pageTitle.textContent = 'Error';
                return;
            }

            let currentChatroomName = 'Unknown Chatroom';

            try {
                const response = await fetch(`/api/v1/chatrooms/${chatroomId}`);
                const data = await response.json();

                if (data.success && data.data.data) {
                    currentChatroomName = data.data.data.name;
                    chatroomTitle.textContent = `Chatroom: ${currentChatroomName}`;
                    pageTitle.textContent = `Chatroom: ${currentChatroomName}`;
                } else {
                    chatroomTitle.textContent = `Chatroom not found: ${chatroomId}`;
                    pageTitle.textContent = 'Chatroom Not Found';
                    return;
                }
            } catch (error) {
                console.error('Error fetching chatroom details:', error);
                chatroomTitle.textContent = 'Error loading chatroom.';
                pageTitle.textContent = 'Error';
                return;
            }

            async function fetchMessages() {
                const response = await fetch(`/api/v1/chatrooms/${chatroomId}/messages`);
                const data = await response.json();
                if (data.success && data.data) {
                    messagesDiv.innerHTML = '';
                    data.data.forEach(msg => {
                        const p = document.createElement('p');
                        p.classList.add('message');
                        p.innerHTML = `<strong>${msg.username}:</strong> ${msg.message}`;
                        messagesDiv.appendChild(p);
                    });
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
            }

            sendButton.addEventListener('click', async () => {
                const messageText = messageInput.value.trim();
                if (messageText) {
                    const response = await fetch(`/api/v1/chatrooms/${chatroomId}/messages`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({username: 'You', message: messageText})
                    });
                    const data = await response.json();
                    if (data.success) {
                        fetchMessages();
                        messageInput.value = '';
                    }
                }
            });

            fetchMessages();
        });
    </script>
</body>
</html>`;
      const uiFilePath = `${CHATROOMS_DIR}/${newChatroom.id}/index.html`;
      await createGitHubFile(uiFilePath, devTemplateContent, `Create chatroom UI for ${newChatroom.id}`);
      // Create chatroom JSON data file (separate from UI folder)
      await createGitHubFile(filePath, newChatroom, `Create chatroom ${newChatroom.id}`);
      return sendResponse(res, { message: 'Chatroom created successfully!', data: newChatroom }, 201);
    } catch (error) {
      console.error('Error creating chatroom on GitHub:', error);
      return sendResponse(res, { message: 'Failed to create chatroom.' }, 500);
    }
  } else if (req.method === 'GET') {
    const pathSegments = req.url.split('/').filter(Boolean);
    let chatroomIdFromPath = null;
    let isMessagesRequest = false;

    if (pathSegments.length >= 4 && pathSegments[2] === 'chatrooms') {
      chatroomIdFromPath = pathSegments[3];
      if (pathSegments.length >= 5 && pathSegments[4] === 'messages') {
        isMessagesRequest = true;
      }
    }

    const pathSegments = req.url.split('/').filter(Boolean);
    let chatroomIdFromPath = null;
    let isMessagesRequest = false;

    if (pathSegments.length >= 4 && pathSegments[2] === 'chatrooms') {
      chatroomIdFromPath = pathSegments[3];
      if (pathSegments.length >= 5 && pathSegments[4] === 'messages') {
        isMessagesRequest = true;
      }
    }

    const id = chatroomIdFromPath; // Prioritize path ID

    if (id) {
      const filePath = `${CHATROOMS_DIR}/${id}.json`;
      try {
        const chatroomData = await getGitHubFile(filePath);
        if (!chatroomData) {
          return sendResponse(res, { message: 'Chatroom not found.' }, 404);
        }
        const chatroom = chatroomData.content;

        if (isMessagesRequest) {
          return sendResponse(res, { data: chatroom.messages });
        }
        return sendResponse(res, { data: chatroom });
      } catch (error) {
        console.error('Error fetching chatroom from GitHub:', error);
        return sendResponse(res, { message: 'Failed to fetch chatroom.' }, 500);
      }
    } else {
      // Get all chatrooms
      try {
        const contents = await getGitHubDirectoryContents(CHATROOMS_DIR);
        const chatroomFiles = contents.filter(item => item.type === 'file' && item.name.endsWith('.json'));
        const allChatrooms = await Promise.all(chatroomFiles.map(async (file) => {
          const fileContent = await getGitHubFile(file.path);
          return fileContent ? fileContent.content : null;
        }));
        const validChatrooms = allChatrooms.filter(Boolean);
        return sendResponse(res, { data: validChatrooms });
      } catch (error) {
        console.error('Error listing chatrooms from GitHub:', error);
        return sendResponse(res, { message: 'Failed to list chatrooms.' }, 500);
      }
    }
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
      const filePath = `${CHATROOMS_DIR}/${id}.json`;
      try {
        const chatroomData = await getGitHubFile(filePath);
        if (!chatroomData) {
          return sendResponse(res, { message: 'Chatroom not found.' }, 404);
        }
        const chatroom = chatroomData.content;
        const sha = chatroomData.sha;

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

        await updateGitHubFile(filePath, chatroom, `Add message to chatroom ${id}`, sha);
        return sendResponse(res, { message: 'Message sent successfully!', data: newMessage }, 201);
      } catch (error) {
        console.error('Error sending message to GitHub:', error);
        return sendResponse(res, { message: 'Failed to send message.' }, 500);
      }
    }
    return sendResponse(res, { message: 'Method Not Allowed for this endpoint.' }, 405);
  } else {
    return sendResponse(res, { message: 'Method Not Allowed' }, 405);
  }
}