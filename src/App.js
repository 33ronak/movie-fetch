import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryingTimeout, setRetryingTimeout] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMoviesList(transformedMovies);
      setRetrying(false);
    } catch (error) {
      setError(error.message);
      setRetrying(true);
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])


  useEffect(() => {
    if (retrying) {
      const timeoutId = setTimeout(fetchMoviesHandler, 5000);
      setRetryingTimeout(timeoutId);
    }

    return () => {
      if (retryingTimeout) {
        clearTimeout(retryingTimeout);
      }
    };
  }, [retrying]);

  const cancelRetryingHandler = () => {
    setRetrying(false);
    if (retryingTimeout) {
      clearTimeout(retryingTimeout);
    }
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {retrying && (
          <button onClick={cancelRetryingHandler}>Cancel Retrying</button>
        )}
      </section>
      <section>
        {!isLoading && moviesList.length > 0 && <MoviesList movies={moviesList} />}
        {!isLoading && moviesList.length === 0 && !error && <p>Found no Movies..!</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
