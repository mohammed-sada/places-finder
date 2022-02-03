import { createApi } from 'unsplash-js';

const API_URL = 'https://api.foursquare.com/v3';

// Initilize Unsplash 
const unsplashApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_ACCESS_KEY,
    fetch
});

async function fetchUnsplashPhotos(query, limit) {
    const result = await unsplashApi.search.getPhotos({
        query,
        perPage: limit
    });
    return result.response.results;
}

function generatePlacesUrl(latLong, query, limit) {
    return `${API_URL}/places/nearby?ll=${latLong}&query${query}=&limit=${limit}`;
}

export async function fetchPlaces(latLong = '37.53356372934816,-120.34942283484592', query = 'coffee stores', limit = 6) {
    const photos = await fetchUnsplashPhotos(query, limit);
    const response = await fetch(generatePlacesUrl(latLong, query, limit), {
        headers: { Authorization: process.env.NEXT_PUBLIC_FOUR_SQUARE_API_KEY },
    });
    const coffeeStoresData = await response.json();

    return coffeeStoresData.results.map((result, idx) => {
        const { fsq_id, name, timezone, location: { adderss, locality, cross_street, region, country } } = result;
        return {
            id: fsq_id,
            name,
            address: adderss || locality || region || country,
            street: cross_street,
            timezone,
            imgUrl: {
                small: photos[idx].urls['small'],
                regular: photos[idx].urls['regular']
            }
        };
    });
};

