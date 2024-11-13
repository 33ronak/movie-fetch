import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryingTimeout, setRetryingTimeout] = useState(null);
  
  const [newMovie, setNewMovie] = useState({
    title: '',
    openingText: '',
    releaseDate: '',
  });

  const [showModal, setShowModal] = useState(false);

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

  const addMovieHandler = () => {
    const newMovieObj = { ...newMovie };
    console.log(newMovieObj);
    setMoviesList((prevMovies) => [...prevMovies, newMovieObj]);
    setNewMovie({
      title: '',
      openingText: '',
      releaseDate: '',
    });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  const openModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={openModalHandler}>Add Movie</button>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {retrying && (
          <button onClick={cancelRetryingHandler}>Cancel Retrying</button>
        )}
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModalHandler}>&times;</span>
            <h2>Add New Movie</h2>
            <div>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={newMovie.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Opening Text</label>
              <input
                type="text"
                name="openingText"
                value={newMovie.openingText}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Release Date</label>
              <input
                type="text"
                name="releaseDate"
                value={newMovie.releaseDate}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={addMovieHandler}>Add Movie</button>
          </div>
        </div>
      )}

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
