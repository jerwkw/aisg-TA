import { Metadata } from 'next';
import Link from 'next/link';
import { ClientImage } from '@/components/ClientImage';
import { getBookDetails } from '@/lib/googlebooksAPI';
import { ErrorMessage } from '@/components/ErrorMessage';
import { GBookItem } from '@/types/googleBooks';

interface BookDetailPageProps {
    params: {
        id: string; // The dynamic route parameter [id]
    };
}

/**
 * Page to display detailed information about a single book.
 * Fetches book details server-side based on the ID from the URL.
 * @param params - Contains the dynamic route parameters (e.g., params.id).
 */
export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id: bookId } = await params;
  let book: GBookItem | null = null;
  let error: string | null = null;

  try {
    book = await getBookDetails(bookId);
  } catch (err) {
     console.error(`Error in BookDetailPage fetch for ID ${bookId}:`, err);

     // Error type checking
     error = err instanceof Error ? err.message : 'An unknown error occurred.';

     // Provide a specific message for common errors
     // Refer to the error messages in the googlebooksAPI.ts file
     if (error.includes('Missing API Key')) {
         error = 'The application is not configured correctly. Please contact the administrator. (Missing API Key)';
     } else if (error.includes('Failed to fetch book details')) {
          error = `Could not retrieve book data. ${error.replace('Failed to fetch book details: ', '')}`;
     } else if (error.toLowerCase().includes('not found')) { // Handle 404 
         error = `Book with ID "${bookId}" could not be found.`;
     }
  }

  // Handle case where book is not found (API might return success but no item)
  if (!error && !book) {
      error = `Book with ID "${bookId}" could not be found.`;
  }

  const volumeInfo = book?.volumeInfo;
  const imageUrl = volumeInfo?.imageLinks?.medium || volumeInfo?.imageLinks?.thumbnail;
  const placeholderImageUrl = '/placeholder-cover.png';

  console.log("Attempting to use Image URL:", imageUrl);
  console.log("Using Placeholder URL:", placeholderImageUrl);
  const finalSrc = imageUrl || placeholderImageUrl;
  console.log("Final src passed to ClientImage:", finalSrc);
  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        &larr; Back to Search
      </Link>

      {error && <ErrorMessage message={error} />}

      {book && volumeInfo && !error && (
        <article className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
           {/* Image Section */}
           <div className="md:w-1/3 p-4 flex justify-center items-start">
           <div className="relative w-48 md:w-full aspect-[2/3]"> {/* Adjust size as needed */}
                <ClientImage
                    src={imageUrl || placeholderImageUrl}
                    fallbackSrc={placeholderImageUrl}
                    alt={`Cover of ${volumeInfo.title}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    className="rounded"
                />
             </div>
           </div>

           {/* Details Section */}
           <div className="md:w-2/3 p-6 md:p-8">
             <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
               {volumeInfo.title}
             </h1>
             {volumeInfo.subtitle && (
               <h2 className="text-lg text-gray-600 mb-4">{volumeInfo.subtitle}</h2>
             )}
             <p className="text-md text-gray-700 mb-4">
               <strong>Author(s):</strong> {volumeInfo.authors?.join(', ') || 'N/A'}
             </p>
             <p className="text-md text-gray-700 mb-4">
               <strong>Publisher:</strong> {volumeInfo.publisher || 'N/A'}
             </p>
             <p className="text-md text-gray-700 mb-4">
               <strong>Published Date:</strong> {volumeInfo.publishedDate || 'N/A'}
             </p>
             {volumeInfo.pageCount && (
                <p className="text-md text-gray-700 mb-4">
                    <strong>Pages:</strong> {volumeInfo.pageCount}
                </p>
             )}

             {/* Use dangerouslySetInnerHTML for potential HTML in description, sanitize if necessary */}
             {volumeInfo.description ? (
                <div className="prose prose-sm max-w-none text-gray-800">
                    <h3 className="text-lg font-semibold mt-4 mb-2">Description</h3>
                    <div dangerouslySetInnerHTML={{ __html: volumeInfo.description }} />
                </div>
             ) : (
                <p className="text-gray-500 italic mt-4">No description available.</p>
             )}

             {/* Add links if available */}
              <div className="mt-6 flex space-x-4">
                 {volumeInfo.previewLink && (
                    <a
                        href={volumeInfo.previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition duration-150 ease-in-out text-sm"
                    >
                        Preview on Google Books
                    </a>
                 )}
                 {volumeInfo.infoLink && (
                    <a
                        href={volumeInfo.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded transition duration-150 ease-in-out text-sm"
                    >
                        More Info
                    </a>
                 )}
              </div>
           </div>
        </article>
      )}
    </main>
  );
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
    const { id } = await params;

    try {
      const book: GBookItem = await getBookDetails(id); // Use 'id'

      if (!book?.volumeInfo?.title) {
          console.warn(`Metadata generation skipped: Book or title not found for ID ${id}`); // Use 'id'
           return {
              title: 'Book Details Not Found',
              description: 'Could not retrieve details for the specified book.',
          };
      }

      const title = book.volumeInfo.title;
      const description = book.volumeInfo.description
        ? (book.volumeInfo.description.length > 160
            ? book.volumeInfo.description.substring(0, 157) + '...'
            : book.volumeInfo.description)
        : `Details about the book ${title}`;

      const imageUrl = book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail;

      return {
        title: `${title} | Book Details`,
        description: description,
        openGraph: imageUrl ? {
            title: title,
            description: description,
            images: [{ url: imageUrl }],
        } : undefined,
      };
    } catch (error) {
      console.error(`Error generating metadata for book ID ${id}:`, error); // Use 'id'
      return {
        title: 'Book Details | Error',
        description: 'Error loading details for this book.',
      };
    }
}