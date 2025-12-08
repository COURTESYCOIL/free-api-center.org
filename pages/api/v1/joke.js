import { sendResponse } from '../../utils/response';

// GitHub API Configuration (reused from chatrooms system)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'COURTESYCOIL';
const GITHUB_REPO = 'free-api-center.org';
const JOKES_FILE_PATH = 'Chatrooms/jokes.json'; // Store jokes in Chatrooms directory
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

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorBody.message}`);
  }
  return response.json();
}

// Helper to get jokes file from GitHub
async function getJokesFromGitHub() {
  const url = `${GITHUB_API_BASE_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${JOKES_FILE_PATH}`;
  try {
    const data = await githubApiRequest(url);
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { jokes: JSON.parse(content), sha: data.sha };
  } catch (error) {
    if (error.message.includes('Not Found')) {
      // Create initial jokes file if it doesn't exist
      const initialJokes = [
        "Why do Java developers wear glasses? Because they don't C#.",
        "There are 10 types of people in this world, those who understand binary and those who don't.",
        "Debugging: Removing the needles from the haystack, only to realize it was a sewing machine all along.",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "My code doesn't have bugs, it has random features."
      ];
      await createGitHubFile(JOKES_FILE_PATH, initialJokes, 'Create initial jokes file');
      return { jokes: initialJokes, sha: null };
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

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
        const { joke } = req.body;

        if (!joke || typeof joke !== 'string' || joke.trim() === '') {
          return sendResponse(res, { message: 'Invalid joke provided.' }, 400);
        }

        const trimmedJoke = joke.trim();
        try {
          // Get current jokes from GitHub
          const { jokes: currentJokes, sha } = await getJokesFromGitHub();

          // Check for duplicate jokes (case-insensitive comparison)
          const jokeExists = currentJokes.some(existingJoke => 
            existingJoke.trim().toLowerCase() === trimmedJoke.toLowerCase()
          );

          if (jokeExists) {
            return sendResponse(res, { message: 'Joke already exists in repository.' }, 409);
          }

          // Add new joke and update GitHub file
          const updatedJokes = [...currentJokes, trimmedJoke];
          if (sha) {
            await updateGitHubFile(JOKES_FILE_PATH, updatedJokes, `Add new joke: ${trimmedJoke.slice(0, 30)}...`, sha);
          } else {
            await createGitHubFile(JOKES_FILE_PATH, updatedJokes, `Add new joke: ${trimmedJoke.slice(0, 30)}...`);
          }

          return sendResponse(res, { message: 'Joke added to repository successfully!', joke: trimmedJoke }, 201);
        } catch (error) {
          console.error('Error adding joke to GitHub:', error);
          return sendResponse(res, { message: 'Failed to add joke to repository.' }, 500);
        }
      } else if (req.method === 'GET') {
        try {
          // Get current jokes from GitHub
          const { jokes: currentJokes } = await getJokesFromGitHub();
          const randomJoke = currentJokes[Math.floor(Math.random() * currentJokes.length)];
          return sendResponse(res, { joke: randomJoke });
        } catch (error) {
          console.error('Error fetching joke from GitHub:', error);
          return sendResponse(res, { message: 'Failed to fetch joke from repository.' }, 500);
        }
      } else {
        return sendResponse(res, { message: 'Method Not Allowed' }, 405);
      }
  } catch (error) {
    console.error('Unhandled error in joke API:', error);
    return sendResponse(res, { message: 'An unexpected server error occurred.' }, 500);
  }
}