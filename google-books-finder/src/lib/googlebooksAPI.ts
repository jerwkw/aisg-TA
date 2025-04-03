import { GBookApiResponse, GBookItem } from "@/types/googleBooks";

const API_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

/**
 * Search for books using the Google Books API.
 * @param query - The search query string to be passed to the API.
 * @param maxResults - Maximum number of results to return (default is 20).
 * @returns A promise that resolves to the API response containing book items.
 * @throws If the API key is missing, the query is invalid, or the fetch fails.
 */
export async function searchBooks(query: string, maxResults: number = 20): Promise<GBookApiResponse> {
    if (!API_KEY) {
        console.error("Google Books API key is not defined in the environment variables. Please check your .env.local file.");
        throw new Error("Error: Missing API key");
    }
    if (!query) {
        // If no query is provided, return an empty response to prevent error 400
        return { kind: 'books#volumes', totalItems: 0, items: [] };
    }

    const url = `${API_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`;
    try {
        const response = await fetch(url, { cache: "no-store" }); // For dynamic data fetching
        
        if (!response.ok) {
            // Attempt to parse the error response
            let errorBody = "Unknown error";
            try {
                const errorResponse = await response.json();
                errorBody = errorResponse?.error?.message || "Unknown error";
            } catch (parseError) {
                // If parsing fails, fall back to the default errorBody
            }

            console.error("Error in Google Books API:", response.status, errorBody);
            throw new Error(`Failed to fetch books: ${errorBody}`);
        }

        const data: GBookApiResponse = await response.json();
        return data;

    } catch (error) {
        console.error(`Error fetching books: ${error}`);
        throw new Error(`Error fetching books: ${error}`);
    }
}

/**
 * Fetches details for a specific book volume by its ID.
 * Should only be called from server-side components/functions.
 * @param bookId - The unique ID of the book volume.
 * @returns A promise that resolves to the detailed book item or throws an error.
 * @throws If the API key is missing, bookId is invalid, or the fetch fails.
 */
export async function getBookDetails(bookId: string): Promise<GBookItem> {
    if (!API_KEY) {
        console.error("Google Books API key is not defined in the environment variables. Please check your .env.local file.");
        throw new Error("Error: Missing API key");
    }
    if (!bookId) {
      throw new Error('Invalid book ID provided.');
    }
  
    const url = `${API_URL}/${bookId}?key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        // Attempt to parse the error response
         let errorBody = 'Unknown error';
        try {
          const errorData = await response.json();
          errorBody = errorData?.error?.message || response.statusText;
        } catch (parseError) {
            // If parsing fails, fall back to the default errorBody
        }

        console.error("Error in Google Books API:", response.status, errorBody);
        throw new Error(`Failed to fetch book details: ${errorBody}`);
      }
  
      const data: GBookItem = await response.json();
      return data;

    } catch (error) {
        console.error(`Error fetching book details for ID ${bookId}:`, error);
        throw new Error(`An unexpected error occurred while fetching book details: ${error}`);
    }
}
