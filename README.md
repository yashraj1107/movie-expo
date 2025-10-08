# Movie Explorer Platform

Movie Explorer is a modern, full-stack web application designed for film enthusiasts to browse, search, and discover movies. Users can explore detailed information about movies, filter by various criteria, and view profiles for actors and directors. This project was built as a full-stack development assignment.

-   **Modern UI:** A sleek, responsive, and animated user interface built with React and Tailwind CSS.
-   **Dynamic Hero Carousel:** Showcases top-rated movies for an engaging first impression.
-   **Comprehensive Filtering:** Filter movies by genre, or use the advanced dropdown to filter by director, actor, and release year.
-   **Sorting:** Sort the movie list by rating (high to low or low to high).
-   **Instant Search:** Search the entire movie catalog by title.
-   **Detailed Pages:** View dedicated pages for movies (with cast & reviews), actors, and directors (with their filmographies).
-   **Favorites System:** Mark movies as favorites, saved in the browser's local storage.
-   **Real-time Data:** The database is seeded with up-to-date information from The Movie Database (TMDb) API.
-   **Fully Containerized:** The entire application is managed with Docker for consistent and easy setup.
-   **Automated Quality Checks:** The build process includes integrated linting and unit testing for both frontend and backend to ensure code quality and reliability.

## Technology Stack

| Area      | Technology                                                                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------ |
| **Backend** | Python, FastAPI, SQLAlchemy, SQLite, Pytest, Ruff                                                             |
| **Frontend**| React, TypeScript, Vite, Tailwind CSS, Framer Motion, Vitest, React Testing Library, ESLint, React Hot Toast |
| **DevOps** | Docker, Docker Compose, Nginx                                                                                 |


## Project Setup (for Evaluation)

These are the primary instructions for cloning and running the project in a production-like environment using Docker.

### Prerequisites

-   [Docker](https://www.docker.com/products/docker-desktop/) must be installed and running on your system.
-   You need a free API key from [The Movie Database (TMDb)](https://www.themoviedb.org/signup).(Only If you want to change the movies)

### Running the Application

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd movie-explorer
    ```

2.  **Add Your TMDb API Key** (Needed Only If you want to change the movies in the db)
    -   Open the `backend/seed.py` file.
    -   Find the line `TMDB_API_KEY = "YOUR_API_KEY_HERE"` and replace the placeholder with your actual TMDb API key.

3.  **Build and Run with Docker Compose**
    -   From the root directory of the project, run this single command. It will build the images, run the database seeder, and start the application.
    ```bash
    docker compose up --build
    ```
    *(The first build may take a few minutes.)*

4.  **Access the Application**
    -   Once the containers are running, open your web browser:
    -   **Frontend Application:** `http://localhost:5173`
    -   **Backend API Docs (Swagger):** `http://localhost:8000/docs`

---
## Development & Re-Seeding the Database

If you wish to run the services locally for development or want to fetch a fresh set of movies from TMDb, follow these steps.

1.  **Get Your API Key**
    -   First, ensure you have your TMDb API key. Place it inside the `TMDB_API_KEY` variable in the `backend/seed.py` file.

2.  **Delete the Old Database**
    -   To get a new set of movies, you must first delete the existing database file. From the project root, run:
    ```bash
    rm backend/movies.db
    ```

3.  **Set Up the Backend Environment**
    -   Navigate into the backend directory, create a virtual environment, activate it, and install the required packages.
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

4.  **Run the Seed Script**
    -   While in the `backend` directory with your virtual environment active, run the seed script. This will connect to the TMDb API and populate your new database.
    ```bash
    python seed.py
    ```
    -   Once finished, you can deactivate the virtual environment with the command `deactivate`. Your new `movies.db` file is now ready. You can now start the full application using `docker compose up`.
