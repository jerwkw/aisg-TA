'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Renders a search bar allowing users to input keywords and initiate a book search.
 * Updates the URL query parameter 'q' on submission.
 */
export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState<string>(initialQuery);
  
    // Update state if the URL query parameter changes externally
    useEffect(() => {
      setQuery(searchParams.get('q') || '');
    }, [searchParams]);
  
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        // Navigate to the same page but update the query parameter
        router.push(`/?q=${encodeURIComponent(trimmedQuery)}`);
      } else {
        // If the query is empty, navigate to the base URL to clear results
        router.push('/');
      }
    };
  
    return (
      <form onSubmit={handleSearch} className="mb-8 w-full max-w-xl mx-auto">
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search keywords..."
            className="w-full px-6 py-3 text-gray-700 focus:outline-none"
            aria-label="Search for books"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition duration-150 ease-in-out"
            aria-label="Submit search"
          >
            Search
          </button>
        </div>
      </form>
    );
  }