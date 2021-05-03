import { ObjectId } from 'bson';

declare global {
  interface MovieBSON {
    _id: ObjectId;
    title: string;
    poster: string;
    plot: string;
    genres: string[];
    runtime: number;
    year: number;
    imdb: {
      rating: number;
      votes: number;
      id: number;
    };
  }

  interface MovieJSON extends MovieBSON {
    _id: string;
  }
}
