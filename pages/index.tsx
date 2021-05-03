import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';

// utilities
import connectMongo from '@utils/connectMongo';
import { encodeId } from '@utils/hashIds';

// components
import MovieGridItem from '@components/movie/MovieGridItem';

interface Props {
  movies: MovieJSON[];
}

const IndexPage = ({
  movies,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo title="mflix movies list" />
      <div className="container max-w-screen-lg mx-auto py-16 px-4">
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
        >
          {movies.map((movie) => (
            <NextLink key={movie._id} href={`/movie/${movie._id}`}>
              <a>
                <MovieGridItem as="li" movie={movie} />
              </a>
            </NextLink>
          ))}
        </ul>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { db } = await connectMongo();

  const cursor = db.collection('movies').aggregate([
    {
      $match: {
        title: { $exists: true },
        poster: { $exists: true },
        plot: { $exists: true },
        genres: { $exists: true },
        runtime: { $exists: true },
        year: { $exists: true },
        'imdb.id': { $exists: true, $ne: '' },
        'imdb.rating': { $exists: true, $ne: '' },
        'imdb.votes': { $exists: true, $ne: '' },
      },
    },
    {
      $sort: {
        'imdb.rating': -1,
      },
    },
    {
      $limit: 30,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        poster: 1,
        plot: 1,
        genres: 1,
        runtime: 1,
        year: 1,
        imdb: 1,
      },
    },
  ]);

  const moviesBSON = (await cursor.toArray()) as MovieBSON[];

  await cursor.close();

  return {
    props: {
      // convert MovieBSON to MovieJSON
      movies: moviesBSON.map(({ _id, ...movie }) => ({
        ...movie,
        _id: encodeId(_id),
      })),
    },
    // revalidate in seconds
    revalidate: 10,
  };
};

export default IndexPage;
