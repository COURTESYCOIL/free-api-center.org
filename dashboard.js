document.addEventListener('DOMContentLoaded', () => {
    const apiList = document.getElementById('api-list');

    const apis = [
        { name: 'Joke API', description: 'Get a random programming joke.', endpoint: '/api/v1/joke' },
        // Add more APIs here
    ];

    apis.forEach(api => {
        const apiCard = document.createElement('div');
        apiCard.classList.add('api-card');
        apiCard.innerHTML = `
            <h2>${api.name}</h2>
            <p>${api.description}</p>
            <button class="fetch-joke-btn" data-endpoint="${api.endpoint}">Get Joke</button>
            <p class="joke-output" id="joke-${api.name.replace(/\s/g, '')}"></p>
        `;
        apiList.appendChild(apiCard);
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