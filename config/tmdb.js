const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.API_KEY;
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Funzione per cercare film e serie
const searchMedia = async (query, type = 'all') => {
    try {
        let requests = [];
        
        if (type === 'movie' || type === 'all') {
            requests.push(
                axios.get(`${TMDB_BASE_URL}/search/movie`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        query: query,
                        language: 'it-IT'
                    }
                })
            );
        }
        
        if (type === 'tv' || type === 'all') {
            requests.push(
                axios.get(`${TMDB_BASE_URL}/search/tv`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        query: query,
                        language: 'it-IT'
                    }
                })
            );
        }
        
        const responses = await Promise.all(requests);
        const results = [];
        
        responses.forEach((response, index) => {
            const mediaType = type === 'all' ? (index === 0 ? 'movie' : 'tv') : type;
            response.data.results.forEach(item => {
                results.push({
                    tmdbId: item.id,
                    title: mediaType === 'movie' ? item.title : item.name,
                    type: mediaType,
                    description: item.overview,
                    posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
                    backdropPath: item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : null,
                    releaseDate: mediaType === 'movie' ? item.release_date : item.first_air_date,
                    rating: item.vote_average
                });
            });
        });
        
        return results;
    } catch (error) {
        console.error('Errore nella ricerca TMDb:', error.message);
        throw new Error('Errore nella ricerca del contenuto');
    }
};

// Funzione per ottenere i dettagli di un film
const getMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'it-IT',
                append_to_response: 'credits,videos'
            }
        });
        
        const data = response.data;
        const cast = data.credits?.cast?.slice(0, 10).map(actor => ({
            name: actor.name,
            character: actor.character,
            profilePath: actor.profile_path ? `${TMDB_IMAGE_BASE}${actor.profile_path}` : null
        })) || [];
        
        const director = data.credits?.crew
            ?.filter(crew => crew.job === 'Director')
            .map(director => ({ name: director.name })) || [];
        
        const trailerUrl = data.videos?.results
            ?.find(video => video.type === 'Trailer' && video.site === 'YouTube')
            ?.key;
        
        return {
            tmdbId: data.id,
            title: data.title,
            type: 'movie',
            description: data.overview,
            posterPath: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : null,
            backdropPath: data.backdrop_path ? `${TMDB_IMAGE_BASE}${data.backdrop_path}` : null,
            releaseDate: data.release_date,
            rating: data.vote_average,
            genres: data.genres.map(g => g.name),
            cast: cast,
            director: director,
            trailerUrl: trailerUrl ? `https://www.youtube.com/watch?v=${trailerUrl}` : null,
            runtime: data.runtime
        };
    } catch (error) {
        console.error('Errore nel recupero dettagli film:', error.message);
        throw new Error('Errore nel recupero dei dettagli del film');
    }
};

// Funzione per ottenere i dettagli di una serie TV
const getTVDetails = async (tvId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'it-IT',
                append_to_response: 'credits,videos'
            }
        });
        
        const data = response.data;
        const cast = data.credits?.cast?.slice(0, 10).map(actor => ({
            name: actor.name,
            character: actor.character,
            profilePath: actor.profile_path ? `${TMDB_IMAGE_BASE}${actor.profile_path}` : null
        })) || [];
        
        const director = data.credits?.crew
            ?.filter(crew => crew.job === 'Director')
            .map(director => ({ name: director.name })) || [];
        
        const trailerUrl = data.videos?.results
            ?.find(video => video.type === 'Trailer' && video.site === 'YouTube')
            ?.key;
        
        return {
            tmdbId: data.id,
            title: data.name,
            type: 'tv',
            description: data.overview,
            posterPath: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : null,
            backdropPath: data.backdrop_path ? `${TMDB_IMAGE_BASE}${data.backdrop_path}` : null,
            releaseDate: data.first_air_date,
            rating: data.vote_average,
            genres: data.genres.map(g => g.name),
            cast: cast,
            director: director,
            trailerUrl: trailerUrl ? `https://www.youtube.com/watch?v=${trailerUrl}` : null,
            numberOfSeasons: data.number_of_seasons
        };
    } catch (error) {
        console.error('Errore nel recupero dettagli serie TV:', error.message);
        throw new Error('Errore nel recupero dei dettagli della serie TV');
    }
};

module.exports = {
    searchMedia,
    getMovieDetails,
    getTVDetails
};
