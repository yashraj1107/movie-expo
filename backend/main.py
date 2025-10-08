from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional


import models
import schemas
import crud
from database import SessionLocal, engine

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
    db: Session = Depends(get_db)
):
    movies = crud.get_movies(
        db, 
        skip=skip, 
        limit=limit, 
        genre_id=genre_id, 
        director_id=director_id,
        actor_id=actor_id,
        year=year
    )
    return movies

@app.get("/api/movies/{movie_id}", response_model=schemas.Movie)
def read_movie(movie_id: int, db: Session = Depends(get_db)):
    db_movie = crud.get_movie(db, movie_id=movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie

@app.get("/api/genres", response_model=List[schemas.Genre])
def read_genres(db: Session = Depends(get_db)):
    genres = crud.get_genres(db)
    return genres

@app.get("/api/directors", response_model=List[schemas.Director])
def read_directors(db: Session = Depends(get_db)):
    directors = crud.get_directors(db)
    return directors
    
@app.get("/api/actors", response_model=List[schemas.Actor])
def read_actors(
    movie_id: Optional[int] = None,
    genre_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    actors = crud.get_actors(db, movie_id=movie_id, genre_id=genre_id)
    return actors

@app.get("/api/search/movies", response_model=List[schemas.Movie])
def search_movies(q: str, db: Session = Depends(get_db)):
    movies = crud.search_movies_by_title(db, query=q)
    return movies

@app.get("/api/actors/{actor_id}", response_model=schemas.ActorDetail)
def read_actor_details(actor_id: int, db: Session = Depends(get_db)):
    db_actor = crud.get_actor(db, actor_id=actor_id)
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return db_actor

@app.get("/api/directors/{director_id}", response_model=schemas.DirectorDetail)
def read_director_details(director_id: int, db: Session = Depends(get_db)):
    db_director = crud.get_director(db, director_id=director_id)
    if db_director is None:
        raise HTTPException(status_code=404, detail="Director not found")
    return db_director