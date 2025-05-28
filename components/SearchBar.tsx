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
        <div className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
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
          placeholder="Search for movies..."
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
    </div>
  );
}