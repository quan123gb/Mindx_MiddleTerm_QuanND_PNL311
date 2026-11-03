import { useState, useEffect } from "react";
const API_BASE_URL = "https://mindx-mockup-server.vercel.app";
const API_KEY = "6ae9f64857cb96e2bc426b33";
const RESOURCE_URL = `${API_BASE_URL}/api/resources/data?apiKey=${API_KEY}`;

const requestHeaders = {
  "Content-Type": "application/json",
};

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-4">
      <div className="flex items-center gap-[100px]">
        <h1 className="text-[36px] font-bold tracking-[2px] text-white">
          Anonime
        </h1>

        <div className="flex items-center gap-[60px]">
          <a
            href="#"
            className="text-[#888888] font-['Poppins'] text-[18px] hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-[#888888] font-['Poppins'] text-[18px] hover:text-white transition-colors"
          >
            List anime
          </a>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search anime or movie"
        className="w-[374px] h-[48px] px-[20px] rounded-[37px] bg-[#374151] text-white text-[14px] outline-none placeholder:text-[#888888]"
      />
    </nav>
  );
}
function MovieBanner({ movie }) {
  if (!movie) return null;

  return (
    <div
      className="relative w-full h-[400px] rounded-[12px] overflow-hidden bg-cover bg-center flex items-end p-[40px] transition-all duration-500"
      style={{
        backgroundImage: `url('${movie.image}')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />

      <div className="relative z-10 flex flex-col gap-3 max-w-[560px]">
        <h2 className="text-[36px] font-bold text-white leading-tight">
          {movie.movieName || movie.title}
        </h2>
        <p className="text-[16px] text-[#888888] leading-relaxed line-clamp-3">
          {movie.description}
        </p>
      </div>
    </div>
  );
}
function Explore({ selectedMovie }) {
  return (
    <section className="my-4">
      <h2 className="text-[36px] font-bold mb-2 text-white">Explore</h2>
      <p className="text-[18px] text-[#888888] mb-6">
        What are you gonna watch today ?
      </p>
      <MovieBanner movie={selectedMovie} />
    </section>
  );
}
function MovieCard({ movie, onSelectMovie }) {
  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="w-[155px] shrink-0 text-center cursor-pointer group"
    >
      <div className="relative w-full h-[225px] rounded-[12px] overflow-hidden">
        <img
          src={movie.image}
          alt={movie.movieName || movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <p className="text-[13px] text-white font-medium">
            {movie.episode?.includes("Episode") ? movie.episode : `Episode ${movie.episode}`}
          </p>
        </div>
      </div>

      <h3 className="text-[15px] font-semibold text-white mt-3 leading-snug line-clamp-2 group-hover:text-[#1688d4] transition-colors">
        {movie.movieName || movie.title}
      </h3>
    </div>
  );
}
function NewRelease({ movies, onSelectMovie }) {
  return (
    <section className="mt-4">
      <h2 className="text-[36px] font-bold text-white mb-6">New Release</h2>
      <div className="flex items-start justify-between gap-[20px] overflow-x-auto pb-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id || movie._id}
            movie={movie}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </div>
    </section>
  );
}
function FormChinh() {
  const [moviesList, setMoviesList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(RESOURCE_URL, {
          method: "GET",
          headers: requestHeaders,
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ máy chủ API");
        }

        const result = await response.json();

        // Xử lý các định dạng dữ liệu trả về từ MindX Server
        const data = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
          ? result.data.data
          : [];

        setMoviesList(data);
        if (data.length > 0) {
          setSelectedMovie(data[0]);
        }
      } catch (err) {
        console.error("Lỗi API:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#171e23] text-white flex items-center justify-center">
        <p className="text-[20px] animate-pulse">Đang tải dữ liệu từ API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171e23] text-white flex items-center justify-center">
        <p className="text-[20px] text-red-500">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171e23] text-white py-6">
      <div className="w-[1170px] mx-auto flex flex-col gap-6">
        <Navbar />
        {selectedMovie && <Explore selectedMovie={selectedMovie} />}
        <NewRelease movies={moviesList} onSelectMovie={setSelectedMovie} />
      </div>
    </div>
  );
}

export default FormChinh;