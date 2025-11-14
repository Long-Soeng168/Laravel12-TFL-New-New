import { useState } from "react";

export default function MyLanguageSwitcherAndSerchInput() {
    const [selectedLang, setSelectedLang] = useState("EN");
    const [open, setOpen] = useState(false);

    const languages = {
      EN: { label: "EN", flag: "https://flagcdn.com/w40/gb.png" },
      KH: { label: "KH", flag: "https://flagcdn.com/w40/kh.png" },
    };

    const toggleDropdown = () => setOpen(!open);
    const handleSelect = (lang) => {
      setSelectedLang(lang);
      setOpen(false);
    };


  return (
    <div className="w-full bg-black p-4 lg:px-16 flex justify-end items-center gap-3">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-900 rounded-full px-3 py-1 shadow-inner">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-white placeholder-gray-400 focus:outline-none px-2 w-40 md:w-64"
        />
      </div>

      {/* Language Switcher */}
      <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center bg-gray-900 text-white px-3 py-1 rounded shadow-inner"
      >
        <img
          src={languages[selectedLang].flag}
          alt={selectedLang}
          className="w-5 h-4 mr-2"
        />
        <span>{languages[selectedLang].label}</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg">
          {Object.entries(languages).map(([key, { label, flag }]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700"
            >
              <img src={flag} alt={label} className="w-5 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
