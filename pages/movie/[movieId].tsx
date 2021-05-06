import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'node:querystring';
import { ObjectId } from 'bson';
import { NextSeo } from 'next-seo';

// utilities
import connectMongo from '@utils/connectMongo';
import { decodeId, encodeId } from '@utils/hashIds';

interface Props {
  movie: MovieJSON;
}

const MovieDetailsPage = ({
  movie: { title, poster, plot, runtime, year },
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title={title}
        description={plot}
        openGraph={{
          title,
          description: plot,
          images: [
            {
              url: poster,
            },
          ],
        }}
      />
      <div className="bg-gray-50 h-screen">
        <div className="max-w-screen-sm sm:py-8 sm:px-4 mx-auto">
          <div className="block w-full aspect-w-16 aspect-h-9 sm:rounded-lg shadow overflow-hidden">
            <img
              src={poster}
              alt=""
              className="object-cover pointer-events-none"
            />
          </div>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="mt-1 text-sm text-gray-900">{year}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Runtime</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {runtime.toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Plot</dt>
                  <dd className="mt-1 text-sm text-gray-900">{plot}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
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
      },
    },
  ]);

  const movieIds = (await cursor.toArray()) as ObjectId[];

  await cursor.close();
  return {
    paths: movieIds.map((_id) => ({
      params: {
        movieId: encodeId(_id),
      },
    })),
    fallback: 'blocking',
  };
};

interface Params extends ParsedUrlQuery {
  movieId: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (!params)
    throw new Error('/movie/[movidId] -  Missing Parmas in getStaticProps.');

  const { movieId } = params;

  const { db } = await connectMongo();

  const movie = (await db.collection('movies').findOne(
    {
      _id: decodeId(movieId),
    },
    {
      projection: {
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
  )) as MovieBSON;

  // Render 404 page if movie does not extists.
  if (!movie)
    return {
      notFound: true,
    };

  return {
    props: {
      movie: {
        ...movie,
        _id: encodeId(movie._id),
      },
    },
    revalidate: 1,
  };
};

export default MovieDetailsPage;
