import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = 'ghp_rTk8xvY8zq5dCRmhUsNj7ny4dgVy13QN9vz'; // Replace with your GitHub Token
const GITHUB_OWNER = 'COURTESYCOIL'; // Replace with your GitHub username
const GITHUB_REPO = 'free-api-center.org'; // Replace with your repository name
const GITHUB_PATH = 'leaderboard-data'; // Path within the repository to store data

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { date } = req.query;

    if (date) {
      // Logic to retrieve historical data from GitHub
      try {
        const response = await octokit.repos.getContent({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          path: `${GITHUB_PATH}/${date}.json`,
        });

        const content = Buffer.from(response.data.content, 'base64').toString('utf8');
        const historicalData = JSON.parse(content);

        res.status(200).json({
          leaderboard: historicalData.leaderboard,
          fetchDate: historicalData.fetchDate,
          availableDates: historicalData.availableDates || [],
        });
      } catch (error) {
        if (error.status === 404) {
          res.status(404).json({ message: 'No data found for this date', error: error.message });
        } else {
          res.status(500).json({ message: 'Failed to retrieve historical data', error: error.message });
        }
      }
    } else {
      // Logic to fetch latest data and potentially store it
      try {
        const response = await fetch('https://territorial.io/clans');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const fetchDate = new Date().toISOString();
        const fileName = fetchDate.split('T')[0]; // YYYY-MM-DD

        // Get existing available dates from GitHub
        let availableDates = [];
        try {
          const { data: contents } = await octokit.repos.getContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: GITHUB_PATH,
          });
          availableDates = contents
            .filter(file => file.name.endsWith('.json'))
            .map(file => file.name.replace('.json', ''))
            .sort((a, b) => new Date(b) - new Date(a)); // Sort descending
        } catch (error) {
          console.error('Failed to get available dates from GitHub:', error);
        }

        // Add current date if not already present
        if (!availableDates.includes(fileName)) {
          availableDates.unshift(fileName); // Add to the beginning
        }

        const fileContent = JSON.stringify({
          leaderboard: data,
          fetchDate: fetchDate,
          availableDates: availableDates,
        }, null, 2);

        // Store data in GitHub
        try {
          const { data: fileData } = await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: `${GITHUB_PATH}/${fileName}.json`,
            message: `Leaderboard data for ${fileName}`,
            content: Buffer.from(fileContent).toString('base64'),
            committer: {
              name: 'GitHub Actions',
              email: 'actions@github.com',
            },
            author: {
              name: 'GitHub Actions',
              email: 'actions@github.com',
            },
          });
          console.log('File created/updated on GitHub:', fileData.content.html_url);
        } catch (githubError) {
          console.error('Failed to store data on GitHub:', githubError);
          // Continue without failing the API call if GitHub storage fails
        }

        res.status(200).json({
          leaderboard: data,
          fetchDate: fetchDate,
          availableDates: [fileName], // Placeholder for available dates
        });
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch leaderboard data', error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}