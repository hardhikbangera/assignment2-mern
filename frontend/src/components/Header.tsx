import { MapPin } from "lucide-react";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  onSearch?: () => void;
}

export default function Header({ searchQuery = "", setSearchQuery, onSearch }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between gap-2">
        {/* ✅ Logo with image + text */}
        <div className="flex items-center space-x-1 cursor-pointer select-none">
          <img src="/logo.png" alt="logo" className="w-24 h-24 object-contain" />
        </div>

        {/* ✅ Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search experiences"
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={onSearch}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
