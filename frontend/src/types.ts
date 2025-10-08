export interface Director {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  image_url: string | null;
}

export interface Movie {
  id: number;
  title: string;
  release_year: number;
  rating: number | null;
  director: Director | null;
  genres: Genre[];
  actors: Actor[];
  poster_url: string | null;
  backdrop_url: string | null;
  synopsis: string | null;
  runtime_minutes: number | null;
}

export interface MovieInProfile {
  id: number;
  title: string;
  release_year: number;
}

export interface ActorDetail extends Actor {
  movies: MovieInProfile[];
}

export interface DirectorDetail extends Director {
  movies: List<MovieInProfile>;
}