import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

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
      const response = await fetch("https://movie-fetch-4cd09-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMoviesList(loadedMovies);
      setRetrying(false);
    } catch (error) {
      setError(error.message);
      setRetrying(true);
    }
    setIsLoading(false);
  }, []);
  

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

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

  const addMovieHandler = async (movie) => {
    const response = await fetch("https://movie-fetch-4cd09-default-rtdb.firebaseio.com/movies.json", {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    console.log(data);
  };

  const deleteMovieHandler = async (id) => {
    const response = await fetch(`https://movie-fetch-4cd09-default-rtdb.firebaseio.com/movies/${id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      console.error('Failed to delete the movie');
      return;
    }
    console.log(`Movie with id ${id} was deleted`);
    fetchMoviesHandler(); // Refresh movie list after deletion
  };
  
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
        <br />
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {retrying && (
          <button onClick={cancelRetryingHandler}>Cancel Retrying</button>
        )}
      </section>

      <section>
        {!isLoading && moviesList.length > 0 && (
          <MoviesList movies={moviesList} onDeleteMovie={deleteMovieHandler} />
        )}
        {!isLoading && moviesList.length === 0 && !error && <p>Found no Movies..!</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
