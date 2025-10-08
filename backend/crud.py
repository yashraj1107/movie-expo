from sqlalchemy.orm import Session
from typing import Optional
import models

def get_movies(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    genre_id: Optional[int] = None, 
    director_id: Optional[int] = None,
    actor_id: Optional[int] = None,
    year: Optional[int] = None,
    sort_by: Optional[str] = None # Add sort_by parameter
):
    query = db.query(models.Movie)

    # --- Filtering Logic ---
    if genre_id:
        query = query.filter(models.Movie.genres.any(id=genre_id))
    if director_id:
        query = query.filter(models.Movie.director_id == director_id)
    if actor_id:
        query = query.filter(models.Movie.actors.any(id=actor_id))
    if year:
        query = query.filter(models.Movie.release_year == year)

    # --- Sorting Logic ---
    if sort_by == 'rating_asc':
        query = query.order_by(models.Movie.rating.asc())
    else: # Default to sorting by rating descending
        query = query.order_by(models.Movie.rating.desc())

    return query.offset(skip).limit(limit).all()


def search_movies_by_title(db: Session, query: str):
    return db.query(models.Movie).filter(models.Movie.title.ilike(f"%{query}%")).all()

def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()

def get_genres(db: Session):
    return db.query(models.Genre).order_by(models.Genre.name).all()

def get_directors(db: Session):
    return db.query(models.Director).order_by(models.Director.name).all()

def get_actors(db: Session, movie_id: Optional[int] = None, genre_id: Optional[int] = None):
    query = db.query(models.Actor)
    if movie_id:
        query = query.filter(models.Actor.movies.any(id=movie_id))
    if genre_id:
        query = query.filter(models.Actor.movies.any(models.Movie.genres.any(id=genre_id)))
    return query.order_by(models.Actor.name).all()

def get_actor(db: Session, actor_id: int):
    return db.query(models.Actor).filter(models.Actor.id == actor_id).first()

def get_director(db: Session, director_id: int):
    return db.query(models.Director).filter(models.Director.id == director_id).first()