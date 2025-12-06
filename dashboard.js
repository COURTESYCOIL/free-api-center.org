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
    jokeSectionHeader.id = 'joke-api-section'; // Add ID for navigation
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
    chatSectionHeader.id = 'chat-api-section'; // Add ID for navigation
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

    // Create Chatroom Section
    const createChatroomCard = document.createElement('div');
    createChatroomCard.classList.add('api-card');
    createChatroomCard.id = 'create-chatroom-section'; // Add ID for navigation
    createChatroomCard.innerHTML = `
        <h2>Create New Chatroom</h2>
        <input type="text" id="new-chatroom-name-input" placeholder="Enter chatroom name...">
        <button id="create-chatroom-btn">Create Chatroom</button>
        <p class="chatroom-output" id="create-chatroom-output"></p>
    `;
    apiList.appendChild(createChatroomCard);

    const submitJokeCard = document.createElement('div');
    submitJokeCard.classList.add('api-card');
    submitJokeCard.id = 'submit-joke-section'; // Add ID for navigation
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
            <li><a href="/chat/dashboard">Chatroom Dashboard</a></li>
        </ul>
    `;
    apiList.appendChild(linksSection);

    // Chat Room Integration Section
    const chatIntegrationSection = document.createElement('div');
    chatIntegrationSection.classList.add('chat-integration-section');
    chatIntegrationSection.innerHTML = `
        <h2>Chat Room Integration</h2>
        <p>You can integrate a chat room into your website using these APIs. Here's how:</p>
        <button id="show-embed-modal-btn">Generate Embed Code</button>
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

    // Embed Modal HTML
    const embedModal = document.createElement('div');
    embedModal.id = 'embed-modal';
    embedModal.classList.add('modal');
    embedModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Embed Chatroom</h2>
            <p>Copy the iframe code below to embed your chatroom:</p>
            <textarea id="embed-code-textarea" rows="5" readonly></textarea>
            <button id="copy-embed-code-btn">Copy Code</button>
        </div>
    `;
    document.body.appendChild(embedModal);

    // Basic Modal Styling (add to style.css later or inline for now)
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Could be more or less, depending on screen size */
            border-radius: 8px;
            position: relative;
        }
        .close-button {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }
        .close-button:hover,
        .close-button:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
        #embed-code-textarea {
            width: 100%;
            resize: vertical;
            margin-bottom: 10px;
        }
        #copy-embed-code-btn {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #copy-embed-code-btn:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(modalStyle);

    // Theme Switcher
    const themeSwitcher = document.createElement('div');
    themeSwitcher.classList.add('theme-switcher');
    themeSwitcher.innerHTML = `
        <button id="theme-toggle">Toggle Dark Mode</button>
    `;
    document.querySelector('.container').prepend(themeSwitcher); // Add to the top of the container

    // Section Navigation Bar
    const navBar = document.createElement('nav');
    navBar.classList.add('section-nav');
    navBar.innerHTML = `
        <a href="#joke-api-section">Joke API</a>
        <a href="#chat-api-section">Chat API</a>
        <a href="#create-chatroom-section">Create Chatroom</a>
        <a href="#submit-joke-section">Submit Joke</a>
        <a href="#links-section">Links</a>
        <a href="#chat-integration-section">Chat Integration</a>
    `;
    document.querySelector('.container').insertBefore(navBar, themeSwitcher.nextSibling);

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

    document.getElementById('create-chatroom-btn').addEventListener('click', async () => {
        const newChatroomNameInput = document.getElementById('new-chatroom-name-input');
        const chatroomName = newChatroomNameInput.value.trim();
        const createChatroomOutput = document.getElementById('create-chatroom-output');

        if (!chatroomName) {
            createChatroomOutput.textContent = 'Please enter a chatroom name.';
            return;
        }

        createChatroomOutput.textContent = 'Creating chatroom...';

        try {
            const response = await fetch('/api/v1/chatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: chatroomName }),
            });
            const data = await response.json();

            if (data.success) {
                createChatroomOutput.textContent = `Success: ${data.data.message} ID: ${data.data.data.id}`;
                newChatroomNameInput.value = ''; // Clear the input
                // Show embed modal after successful creation
                showEmbedModal(data.data.data.id);
            } else {
                createChatroomOutput.textContent = `Error: ${data.data.message || 'Failed to create chatroom.'}`;            }
        } catch (error) {
            console.error('Error creating chatroom:', error);
            createChatroomOutput.textContent = 'Error creating chatroom.';
        }
    });

    // Embed Modal Logic
    const embedModalElement = document.getElementById('embed-modal');
    const closeButton = embedModalElement.querySelector('.close-button');
    const showEmbedModalBtn = document.getElementById('show-embed-modal-btn');
    const embedCodeTextarea = document.getElementById('embed-code-textarea');
    const copyEmbedCodeBtn = document.getElementById('copy-embed-code-btn');

    function showEmbedModal(chatroomId) {
        const embedCode = `<iframe src="${window.location.origin}/chat/dev?id=${chatroomId}" width="600" height="400" frameborder="0"></iframe>`;
        embedCodeTextarea.value = embedCode;
        embedModalElement.style.display = 'block';
    }

    closeButton.addEventListener('click', () => {
        embedModalElement.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == embedModalElement) {
            embedModalElement.style.display = 'none';
        }
    });

    showEmbedModalBtn.addEventListener('click', () => {
        // For demonstration, let's assume a chatroom ID is available or prompt the user
        // In a real app, you might fetch the last created ID or have a selection
        const lastCreatedChatroomId = localStorage.getItem('lastCreatedChatroomId'); // Example
        if (lastCreatedChatroomId) {
            showEmbedModal(lastCreatedChatroomId);
        } else {
            alert('Please create a chatroom first to generate embed code.');
        }
    });

    copyEmbedCodeBtn.addEventListener('click', () => {
        embedCodeTextarea.select();
        document.execCommand('copy');
        alert('Embed code copied to clipboard!');
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

    document.querySelectorAll('.section-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});