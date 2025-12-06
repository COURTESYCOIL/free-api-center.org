document.addEventListener('DOMContentLoaded', () => {
    const apiList = document.getElementById('api-list');

    const apis = [
        { name: 'Joke API', description: 'Get a random joke.', endpoint: '/api/v1/joke' },
        // Add more APIs here
    ];

    apis.forEach(api => {
        const apiCard = document.createElement('div');
        apiCard.classList.add('api-card');
        apiCard.innerHTML = `
            <h2>${api.name}</h2>
            <p>${api.description}</p>
            <a href="${api.endpoint}" target="_blank">Test Endpoint</a>
        `;
        apiList.appendChild(apiCard);
    });
});