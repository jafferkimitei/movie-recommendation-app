
"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <Input
      placeholder="Search for a movie..."
      value={search}
      onChange={handleChange}
      className="max-w-md"
    />
  );
}
