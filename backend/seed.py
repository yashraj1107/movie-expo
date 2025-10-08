import requests
import time
from database import SessionLocal, engine
import models

TMDB_API_KEY = "API_KEY" 
BASE_IMAGE_URL = "https://image.tmdb.org/t/p/"

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

def get_movie_data():
    print("Fetching data from TMDb...")
    all_movie_ids = []
    for page in range(1, 4):
        print(f"Fetching page {page} of top rated movies...")
        url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}&language=en-US&page={page}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            page_ids = [movie['id'] for movie in response.json().get('results', [])]
            all_movie_ids.extend(page_ids)
            time.sleep(0.5)
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch page {page}: {e}")
            continue

    movies_data = []
    for movie_id in all_movie_ids:
        try:
            details_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
            details_res = requests.get(details_url)
            details_res.raise_for_status()
            details = details_res.json()

            credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}&language=en-US"
            credits_res = requests.get(credits_url)
            credits_res.raise_for_status()
            credits = credits_res.json()
            
            director = next((p for p in credits.get('crew', []) if p.get('job') == 'Director'), None)
            
            movies_data.append({
                "details": details,
                "director": director,
                "actors": credits.get('cast', [])[:10]
            })
            print(f"Fetched details for: {details.get('title', 'Unknown')}")
        except requests.exceptions.RequestException as e:
            print(f"Could not fetch details for movie ID {movie_id}: {e}")
        time.sleep(0.25)
    return movies_data

def seed_database():
    if db.query(models.Movie).count() > 0:
        print("Database already has data. Skipping seed.")
        return

    movie_data = get_movie_data()
    
    db_cache = {
        "genres": {g.name: g for g in db.query(models.Genre).all()},
        "actors": {a.name: a for a in db.query(models.Actor).all()},
        "directors": {d.name: d for d in db.query(models.Director).all()}
    }

    for data in movie_data:
        details = data['details']
        
        director_info = data['director']
        director_obj = None
        if director_info and director_info.get('name'):
            if director_info['name'] not in db_cache["directors"]:
                new_director = models.Director(name=director_info['name'])
                db.add(new_director)
                db.flush()
                db_cache["directors"][director_info['name']] = new_director
            director_obj = db_cache["directors"][director_info['name']]

        genre_objs = []
        for g_info in details.get('genres', []):
            if g_info.get('name') and g_info['name'] not in db_cache["genres"]:
                new_genre = models.Genre(name=g_info['name'])
                db.add(new_genre)
                db.flush()
                db_cache["genres"][g_info['name']] = new_genre
            if g_info.get('name'):
                genre_objs.append(db_cache["genres"][g_info['name']])

        actor_objs = []
        for a_info in data.get('actors', []):
            if a_info.get('name') and a_info['name'] not in db_cache["actors"]:
                img_url = f"{BASE_IMAGE_URL}w185{a_info['profile_path']}" if a_info.get('profile_path') else None
                new_actor = models.Actor(name=a_info['name'], image_url=img_url)
                db.add(new_actor)
                db.flush()
                db_cache["actors"][a_info['name']] = new_actor
            if a_info.get('name'):
                actor_objs.append(db_cache["actors"][a_info['name']])

        
        if not db.query(models.Movie).filter(models.Movie.title == details.get('title')).first() and details.get('title'):
            new_movie = models.Movie(
                title=details['title'],
                release_year=int(details['release_date'].split('-')[0]) if details.get('release_date') else 0,
                rating=details.get('vote_average'),
                poster_url=f"{BASE_IMAGE_URL}w500{details.get('poster_path')}" if details.get('poster_path') else None,
                backdrop_url=f"{BASE_IMAGE_URL}w1280{details.get('backdrop_path')}" if details.get('backdrop_path') else None,
                synopsis=details.get('overview'),
                runtime_minutes=details.get('runtime'),
                director=director_obj, genres=genre_objs, actors=actor_objs
            )
            db.add(new_movie)

    print("Committing data to database...")
    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
    db.close()
