const fetchData = async () => {
    try {
        const response = await fetch('travel_recommendation.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const searchRecommendations = (data, keyword) => {
    keyword = keyword.toLowerCase();
    const results = [];

    if (keyword.includes('beach')) {
        results.push(...data.beaches);
    }
    if (keyword.includes('temple')) {
        results.push(...data.temples);
    }
    data.countries.forEach(country => {
        if (keyword.includes(country.name.toLowerCase())) {
            results.push(...country.cities);
        }
    });

    return results;
};

const displayRecommendations = (recommendations) => {
    const resultDiv = document.getElementById('recommendationResults');
    resultDiv.innerHTML = '';

    recommendations.forEach(place => {
        const placeElement = `
            <div class="bg-white shadow-lg rounded-lg p-4">
                <img src="${place.imageUrl}" alt="${place.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                <h3 class="text-xl font-bold text-neutral">${place.name}</h3>
                <p class="text-neutral">${place.description}</p>
            </div>
        `;
        resultDiv.innerHTML += placeElement;
    });
};

document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('recommendationResults').innerHTML = '';
    document.getElementById('searchInput').value = '';
});

const displayCountryTime = (timezone) => {
    const options = { timeZone: timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const currentTime = new Date().toLocaleTimeString('en-US', options);
    console.log(`Current time in ${timezone}:`, currentTime);
};

document.getElementById('searchBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('searchInput').value;
    const data = await fetchData();
    
    const recommendations = searchRecommendations(data, keyword);

    if (recommendations.length > 0) {
        displayRecommendations(recommendations);
        if (keyword.includes('australia')) {
            displayCountryTime('Australia/Sydney');
        }
    } else {
        document.getElementById('recommendationResults').innerHTML = '<p>No results found.</p>';
    }
});
