import React, { FC } from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
  movie: MovieJSON;
  as?: keyof JSX.IntrinsicElements;
}

const MovieGridItem: FC<Props> = ({
  className,
  movie,
  as: Component = 'div',
}) => {
  return (
    <Component className={cn(className, 'relative')}>
      <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden">
        <img
          src={movie.poster}
          alt=""
          className="object-cover pointer-events-none group-hover:opacity-75"
          loading="lazy"
        />
        <button type="button" className="absolute inset-0 focus:outline-none">
          <span className="sr-only">View details for {movie.title}</span>
        </button>
      </div>
      <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
        {movie.title}
      </p>
      <p className="block text-sm font-medium text-gray-500 pointer-events-none">
        {movie.plot}
      </p>
    </Component>
  );
};

export default MovieGridItem;
