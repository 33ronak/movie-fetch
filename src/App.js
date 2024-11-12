import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [moviesList, setMoviesList] = useState([])

  const fetchMoviesHandler = () => {
    fetch("https://swapi.dev/api/films/").then(response => {
      return response.json();
    }).then(data => {
      const tranformedMovies = data.results.map(moviedata => {
        return {
          id: moviedata.episode_id,
          title: moviedata.title,
          openingText: moviedata.opening_crawl,
          releaseDate: moviedata.release_date
        }
      });
      setMoviesList(tranformedMovies);
    });
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} >Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={moviesList} />
      </section>
    </React.Fragment>
  );
}

export default App;
