document.addEventListener('DOMContentLoaded', () => {
    const apiList = document.getElementById('api-list');

    // Split APIs into distinct sections
    const jokeApis = [
        { name: 'Joke API', description: 'Get a random programming joke.', endpoint: '/api/v1/joke', buttonText: 'Get Joke' }
    ];

    const chatApis = [
        { name: 'Chat Username API', description: 'Get or set a chat username.', endpoint: '/api/v1/chat/username', buttonText: 'Get Data' },
        { name: 'Chat Message API', description: 'Get or send chat messages.', endpoint: '/api/v1/chat/message', buttonText: 'Get Data' },
        { name: 'Chat Profile Picture API', description: 'Get or set a chat profile picture.', endpoint: '/api/v1/chat/profile_picture', buttonText: 'Get Data' }
    ];

    // Joke API Section
    const jokeSectionHeader = document.createElement('h2');
    jokeSectionHeader.textContent = 'Joke API Section';
    apiList.appendChild(jokeSectionHeader);

    jokeApis.forEach(api => {
        const apiCard = document.createElement('div');
        apiCard.classList.add('api-card');
        apiCard.innerHTML = `
            <h2>${api.name}</h2>
            <p>${api.description}</p>
            <button class="fetch-joke-btn" data-endpoint="${api.endpoint}">${api.buttonText}</button>
            <p class="joke-output" id="joke-${api.name.replace(/\s/g, '')}"></p>
        `;
        apiList.appendChild(apiCard);
    });

    // Chat API Section
    const chatSectionHeader = document.createElement('h2');
    chatSectionHeader.textContent = 'Chat API Section';
    apiList.appendChild(chatSectionHeader);

    chatApis.forEach(api => {
        const apiCard = document.createElement('div');
        apiCard.classList.add('api-card');
        apiCard.innerHTML = `
            <h2>${api.name}</h2>
            <p>${api.description}</p>
            <button class="fetch-joke-btn" data-endpoint="${api.endpoint}">${api.buttonText}</button>
            <p class="joke-output" id="joke-${api.name.replace(/\s/g, '')}"></p>
        `;
        apiList.appendChild(apiCard);
    });

    const submitJokeCard = document.createElement('div');
    submitJokeCard.classList.add('api-card');
    submitJokeCard.innerHTML = `
        <h2>Submit a New Joke</h2>
        <textarea id="new-joke-input" placeholder="Enter your joke here..."></textarea>
        <button id="submit-joke-btn">Submit Joke</button>
        <p class="joke-output" id="submit-joke-output"></p>
    `;
    apiList.appendChild(submitJokeCard);

    // Links Section
    const linksSection = document.createElement('div');
    linksSection.classList.add('links-section');
    linksSection.innerHTML = `
        <h2>Links</h2>
        <ul>
            <li><a href="/wiki">Wiki Page</a></li>
        </ul>
    `;
    apiList.appendChild(linksSection);

    // Chat Room Integration Section
    const chatIntegrationSection = document.createElement('div');
    chatIntegrationSection.classList.add('chat-integration-section');
    chatIntegrationSection.innerHTML = `
        <h2>Chat Room Integration</h2>
        <p>You can integrate a chat room into your website using these APIs. Here's how:</p>
        <pre><code>
// Example: Fetching messages
fetch('/api/v1/chat/message')
    .then(response => response.json())
    .then(data => console.log(data));

// Example: Sending a message
fetch('/api/v1/chat/message', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: 'NewUser', message: 'Hello from my website!' }),
})
    .then(response => response.json())
    .then(data => console.log(data));
        </code></pre>
        <p>Credits: This chat API was developed by Painsel for the Free APIs Center.</p>
    `;
    apiList.appendChild(chatIntegrationSection);

    // Theme Switcher
    const themeSwitcher = document.createElement('div');
    themeSwitcher.classList.add('theme-switcher');
    themeSwitcher.innerHTML = `
        <button id="theme-toggle">Toggle Dark Mode</button>
    `;
    document.querySelector('.container').prepend(themeSwitcher); // Add to the top of the container

    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light-mode';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    document.getElementById('submit-joke-btn').addEventListener('click', async () => {
        const newJokeInput = document.getElementById('new-joke-input');
        const joke = newJokeInput.value.trim();
        const submitJokeOutput = document.getElementById('submit-joke-output');

        if (!joke) {
            submitJokeOutput.textContent = 'Please enter a joke.';
            return;
        }

        submitJokeOutput.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/v1/joke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ joke }),
            });
            const data = await response.json();

            if (data.success) {
                submitJokeOutput.textContent = `Success: ${data.message}`;
                newJokeInput.value = ''; // Clear the input
            } else {
                submitJokeOutput.textContent = `Error: ${data.message || 'Failed to submit joke.'}`;
            }
        } catch (error) {
            console.error('Error submitting joke:', error);
            submitJokeOutput.textContent = 'Error submitting joke.';
        }
    });

    document.querySelectorAll('.fetch-joke-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const endpoint = event.target.dataset.endpoint;
            const apiName = event.target.previousElementSibling.previousElementSibling.textContent.replace(/\s/g, '');
            const jokeOutput = document.getElementById(`joke-${apiName}`);
            jokeOutput.textContent = 'Loading...';

            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                if (data.success) {
                    jokeOutput.textContent = data.data.joke;
                } else {
                    jokeOutput.textContent = 'Failed to fetch joke.';
                }
            } catch (error) {
                console.error('Error fetching joke:', error);
                jokeOutput.textContent = 'Error fetching joke.';
            }
        });
    });
});