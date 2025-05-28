"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path?: string;
  profile_path?: string;
  known_for?: any[];
};

type SearchBarProps = {
  onSearch: (query: string, results: SearchResult[]) => void;
  onFocusChange?: (isFocused: boolean) => void;
};

export default function SearchBar({ onSearch, onFocusChange }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onFocusChange) {
      onFocusChange(isFocused);
    }
  }, [isFocused, onFocusChange]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // Combine movies and people results
        const combinedResults = [
          ...(data.movies || []).map((movie: any) => ({ ...movie, media_type: 'movie' })),
          ...(data.people || []).map((person: any) => ({ ...person, media_type: 'person' }))
        ];
        
        setSuggestions(combinedResults);
        onSearch(query, combinedResults);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
      onSearch(query, []);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    onSearch("", []);
  };

  const selectSuggestion = (item: SearchResult) => {
    setSearch(item.title || item.name || "");
    onSearch(item.title || item.name || "", [item]);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl transition-opacity duration-300 ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
      
      {/* Main search container */}
      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ? 'text-purple-400' : 'text-slate-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input field */}
        <Input
          placeholder="Search for movies, actors, directors..."
          value={search}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          className={`w-full h-14 pl-12 pr-12 bg-slate-800/40 backdrop-blur-sm border-slate-700/50 rounded-2xl text-slate-100 placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ${
            isFocused ? 'shadow-lg shadow-purple-500/10' : ''
          }`}
        />

        {/* Clear button */}
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full hover:bg-slate-700/50 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 text-slate-400 hover:text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 z-20 max-h-96 overflow-y-auto">
          {search.length === 0 ? (
            <>
              <p className="text-sm text-slate-400 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Marvel', 'Horror', 'Comedy', 'Action', 'Sci-Fi'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearch(term);
                      handleChange({ target: { value: term } } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="px-3 py-1 bg-slate-700/50 hover:bg-purple-600/20 hover:border-purple-500/50 border border-slate-600/50 rounded-full text-xs text-slate-300 hover:text-purple-300 transition-all duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </>
          ) : suggestions.length > 0 ? (
            <div className="space-y-2">
              {suggestions.slice(0, 10).map((item) => (
                <button
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => selectSuggestion(item)}
                  className="w-full flex items-center p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 text-left"
                >
                  {item.media_type === 'movie' ? (
                    <>
                      {item.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.title}
                          className="w-10 h-14 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <p className="text-slate-100">{item.title}</p>
                        <p className="text-xs text-slate-400">Movie</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {item.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.profile_path}`}
                          alt={item.name}
                          className="w-10 h-14 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <p className="text-slate-100">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.known_for?.map((work) => work.title || work.name).join(', ')}
                        </p>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No results found</p>
          )}
        </div>
      )}
    </div>
  );
}