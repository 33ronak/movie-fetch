import React from 'react';

import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = (props) => {
  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <>
          <Movie
            key={movie.id}
            title={movie.title}
            releaseDate={movie.releaseDate}
            openingText={movie.openingText}
          />
          <button onClick={() => props.onDeleteMovie(movie.id)}>Delete</button>
        </>
      ))}
    </ul>
  );
};

export default MovieList;
