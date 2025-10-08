import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from main import app, get_db
from database import Base  
import models 


# --- Test database setup ---
# Use a single, shared in-memory SQLite across all connections
TEST_DB_URL = "sqlite://"
engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # critical: share the same in-memory DB
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def session() -> Session:
    """Fresh schema for each test function."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(session: Session):
    """TestClient that uses the test DB session via dependency override."""
    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# --- Tests ---

def test_read_movies_endpoint(client: TestClient, session: Session):
    """GET /api/movies returns empty list when no movies exist."""
    resp = client.get("/api/movies")
    assert resp.status_code == 200
    assert resp.json() == []


def test_read_movie_not_found(client: TestClient, session: Session):
    """GET /api/movies/{id} returns 404 for non-existent movie."""
    resp = client.get("/api/movies/99999")
    assert resp.status_code == 404


def test_create_and_read_movie(client: TestClient, session: Session):
    """Insert a movie directly via session, then fetch via API."""
    director = models.Director(name="Test Director")
    session.add(director)
    session.commit()

    movie = models.Movie(title="Test Movie", release_year=2025, director_id=director.id)
    session.add(movie)
    session.commit()
    session.refresh(movie)

    resp = client.get(f"/api/movies/{movie.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Test Movie"
    assert data["director"]["name"] == "Test Director"
