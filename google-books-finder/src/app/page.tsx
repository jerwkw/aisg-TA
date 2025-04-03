import { SearchBar } from '@/components/SearchBar';
import { BookList } from '@/components/BookList';
import { ErrorMessage } from '@/components/ErrorMessage';
import { searchBooks } from '@/lib/googlebooksAPI';
import { GBookApiResponse } from '@/types/googleBooks';

interface HomePageProps {
  searchParams?: { // Next.js passes searchParams as props in App Router
    q?: string;
  };
}

/**
 * The main page of the application.
 * Displays the search bar and the list of book results based on the 'q' URL parameter.
 * Fetches data server-side.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const query = searchParams?.q || '';
  let searchResults: GBookApiResponse | null = null;
  let error: string | null = null;

  // Fetch results only if a query exists
  if (query) {
    try {
      searchResults = await searchBooks(query);
    } catch (err) {
        console.error("Error in HomePage fetch:", err);

        // Error type checking
        error = err instanceof Error ? err.message : 'An unknown error occurred while searching.';

        // Provide a specific message for common errors
        // Refer to the error messages in the googlebooksAPI.ts file
        if (error.includes('Missing API Key')) {
            error = 'The application is not configured correctly. Please contact the administrator. (Missing API Key)';
        } else if (error.includes('Failed to fetch books')) {
             error = `Could not retrieve book data. ${error.replace('Failed to fetch books: ', '')}`;
        }
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Google Books Finder
      </h1>

      <SearchBar />

      {/* Display Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Display Search Results */}
      {searchResults && !error && (
        <>
          <p className="text-center text-gray-600 mb-4">
            {searchResults.totalItems > 0
              ? `Showing ${searchResults.items?.length || 0} of ${searchResults.totalItems} results for "${query}"`
              : `No results found for "${query}"`}
          </p>
          <BookList books={searchResults.items || []} />
        </>
      )}

      {/* Display Initial Prompt */}
      {!query && !error && (
        <p className="text-center text-gray-500 mt-8">
          Enter a search term above to find books.
        </p>
      )}
    </main>
  );
}
