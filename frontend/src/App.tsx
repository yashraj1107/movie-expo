import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import MovieListPage from "./pages/MovieListPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import ActorProfilePage from "./pages/ActorProfilePage";
import DirectorProfilePage from "./pages/DirectorProfilePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#334155", color: "#fff" } }}
      />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MovieListPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailPage />} />
          <Route path="/actors/:actorId" element={<ActorProfilePage />} />
          <Route
            path="/directors/:directorId"
            element={<DirectorProfilePage />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
