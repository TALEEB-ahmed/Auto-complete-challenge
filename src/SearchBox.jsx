import dataset from '../dataset.js'
import { useState,useMemo } from 'react'

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’‘`]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const searchableCountries = useMemo(() => {
    return dataset.map((country) => ({
      name: country,
      normalizedName: normalizeText(country),
    }));
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) return [];

    return searchableCountries
      .filter((country) =>
        country.normalizedName.includes(normalizedQuery)
      )
      .slice(0, 10);
  }, [query, searchableCountries]);

  function handleChange(event) {
    setQuery(event.target.value);
    setSelectedCountry("");
  }

  function handleSelect(country) {
    setQuery(country);
    setSelectedCountry(country);
  }

  function handleClear() {
    setQuery("");
    setSelectedCountry("");
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <label
        htmlFor="country-search"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Search for a country
      </label>

      <div className="relative">
        <input
          id="country-search"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type a country name..."
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        )}
      </div>

      {query.trim() !== "" && !selectedCountry && (
        <ul className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {results.length > 0 ? (
            results.map((country) => (
              <li key={country.name}>
                <button
                  type="button"
                  onClick={() => handleSelect(country.name)}
                  className="w-full rounded-md px-3 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  {country.name}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">
              No countries found.
            </li>
          )}
        </ul>
      )}

      {selectedCountry && (
        <p className="mt-4 text-sm text-green-700">
          Selected country: {selectedCountry}
        </p>
      )}
    </div>
  );
}
