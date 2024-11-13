import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fetchMoviesHandler = async () => {
    try {
      setisLoading(true);
      const response = await fetch("https://swapi.dev/api/films/");
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMoviesList(transformedMovies);
      setisLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && moviesList.length > 0 && <MoviesList movies={moviesList} />}
        {!isLoading && moviesList.length === 0 && <p>Found no Movies..!</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
