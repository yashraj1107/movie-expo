from pydantic import BaseModel
from typing import List, Optional

class GenreBase(BaseModel):
    name: str

class ActorBase(BaseModel):
    name: str
    image_url: Optional[str] = None

class DirectorBase(BaseModel):
    name: str

class MovieBase(BaseModel):
    title: str
    release_year: int
    rating: Optional[float] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    synopsis: Optional[str] = None
    runtime_minutes: Optional[int] = None

class Genre(GenreBase):
    id: int
    class Config:
        orm_mode = True

class Actor(ActorBase):
    id: int
    class Config:
        orm_mode = True

class Director(DirectorBase):
    id: int
    class Config:
        orm_mode = True

class Movie(MovieBase):
    id: int
    director: Optional[Director] = None
    genres: List[Genre] = []
    actors: List[Actor] = []
    class Config:
        orm_mode = True

class MovieInProfile(BaseModel):
    id: int
    title: str
    release_year: int
    class Config:
        orm_mode = True

class ActorDetail(Actor):
    movies: List[MovieInProfile] = []
    class Config:
        orm_mode = True

class DirectorDetail(Director):
    movies: List[MovieInProfile] = []
    class Config:
        orm_mode = True
        
class Review(BaseModel):
    author: str
    content: str