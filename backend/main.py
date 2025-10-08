from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
import crud
from database import SessionLocal, engine
import requests # Import requests for the reviews endpoint

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Middleware ---
origins = ["http://localhost:5173", "http://localhost:5174"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/api/movies", response_model=List[schemas.Movie])
def read_movies(
    skip: int = 0,
    limit: int = 100,
    genre_id: Optional[int] = None,
    director_id: Optional[int] = None,
    actor_id: Optional[int] = None,
    year: Optional[int] = None,
    sort_by: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of movies with extensive filtering and sorting options.
    """
    movies = crud.get_movies(
        db, 
        skip=skip, 
        limit=limit, 
        genre_id=genre_id, 
        director_id=director_id,
        actor_id=actor_id,
        year=year,
        sort_by=sort_by
    )
    return movies

@app.get("/api/search/movies", response_model=List[schemas.Movie])
def search_movies(q: str, db: Session = Depends(get_db)):
    """
    Search for movies by a query string matching the title.
    """
    movies = crud.search_movies_by_title(db, query=q)
    return movies

@app.get("/api/movies/{movie_id}", response_model=schemas.Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Retrieve details for a single movie by its ID.
    """
    db_movie = crud.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie

@app.get("/api/genres", response_model=List[schemas.Genre])
def read_genres(db: Session = Depends(get_db)):
    """
    Retrieve a list of all available genres.
    """
    genres = crud.get_genres(db)
    return genres

@app.get("/api/directors", response_model=List[schemas.Director])
def read_directors(db: Session = Depends(get_db)):
    """
    Retrieve a list of all available directors.
    """
    directors = crud.get_directors(db)
    return directors

@app.get("/api/actors", response_model=List[schemas.Actor])
def read_actors(
    movie_id: Optional[int] = None,
    genre_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of actors with optional filtering by movie or genre.
    """
    actors = crud.get_actors(db, movie_id=movie_id, genre_id=genre_id)
    return actors

@app.get("/api/actors/{actor_id}", response_model=schemas.ActorDetail)
def read_actor_details(actor_id: int, db: Session = Depends(get_db)):
    """
    Retrieve details for a single actor by their ID, including filmography.
    """
    db_actor = crud.get_actor(db, actor_id=actor_id)
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return db_actor

@app.get("/api/directors/{director_id}", response_model=schemas.DirectorDetail)
def read_director_details(director_id: int, db: Session = Depends(get_db)):
    """
    Retrieve details for a single director by their ID, including filmography.
    """
    db_director = crud.get_director(db, director_id=director_id)
    if db_director is None:
        raise HTTPException(status_code=404, detail="Director not found")
    return db_director

@app.get("/api/movies/{movie_id}/reviews", response_model=List[schemas.Review])
def read_movie_reviews(movie_id: int):
    """
    Fetches up to 3 top reviews for a specific movie from the TMDb API.
    """
    from seed import TMDB_API_KEY
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_API_KEY_HERE":
        return []
        
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/reviews?api_key={TMDB_API_KEY}&language=en-US&page=1"
    try:
        response = requests.get(url)
        response.raise_for_status()
        reviews = response.json().get('results', [])
        return [{"author": r['author'], "content": r['content']} for r in reviews[:3]]
    except requests.exceptions.RequestException:
        return []
