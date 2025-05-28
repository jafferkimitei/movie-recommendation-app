"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
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
          onBlur={() => setIsFocused(false)}
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

      {/* Search suggestions or recent searches could go here */}
      {isFocused && search.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 z-20">
          <p className="text-sm text-slate-400 mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {['Marvel', 'Horror', 'Comedy', 'Action', 'Sci-Fi'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearch(term);
                  onSearch(term);
                }}
                className="px-3 py-1 bg-slate-700/50 hover:bg-purple-600/20 hover:border-purple-500/50 border border-slate-600/50 rounded-full text-xs text-slate-300 hover:text-purple-300 transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}