import React, { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search for products...",
  onSearch,
  loading = false,
}) => {
  const [query, setQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      onSearch(query.trim());
    }, 400);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, onSearch]);

  const clearInput = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query.trim());
      }}
      className={`relative mx-auto border flex items-center rounded-full p-1
        ${isFocused ? "bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500" : "bg-white/50"}
      `}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        aria-label="Search products"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-grow border rounded-full bg-background px-4 py-2.5 text-base font-semibold text-foreground placeholder-gray-400 outline-none transition focus:ring-4 focus:ring-purple-400/50 focus:ring-opacity-70"
      />

      {query && !loading && (
        <button
          type="button"
          onClick={clearInput}
          aria-label="Clear search"
          className="absolute right-16 rounded-full bg-gray-200 hover:bg-gray-300 p-1.5 text-gray-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`ml-3 mr-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-150 ${
          loading ? "cursor-not-allowed opacity-60" : "hover:scale-110"
        }`}
        aria-label="Search"
      >
        {loading ? (
          <svg
            className="h-5 w-5 animate-spin text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx={11} cy={11} r={7} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
        )}
      </button>
    </form>
  );
};

export default SearchInput;
