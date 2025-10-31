import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

interface Experience {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image_url: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filtered, setFiltered] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/experiences`);
      const data = await res.json();
      setExperiences(data);
      setFiltered(data);
    } catch {
      setError("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return setFiltered(experiences);
    setFiltered(
      experiences.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">Loading experiences...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={
                    exp.image_url?.startsWith("http")
                      ? exp.image_url
                      : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${exp.image_url}`
                  }
                  alt={exp.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-semibold">{exp.name}</h3>
                    <span className="text-sm text-gray-600">{exp.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{exp.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">₹{exp.price}</span>
                    <button
                      onClick={() => navigate(`/details/${exp.id}`)}
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
