'use client'; 
import Link from 'next/link';
import { ClientImage } from '@/components/ClientImage'; 
import { GBookItem } from '@/types/googleBooks';

interface BookCardProps {
  book: GBookItem;
}

/**
 * Renders a card displaying basic information about a book, linking to its detail page.
 * Handles missing cover images gracefully.
 * @param book - The GBookItem object containing book data.
 */
export function BookCard({ book }: BookCardProps) {
  const { id, volumeInfo } = book;
  const title = volumeInfo.title;
  const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
  // We use regular thumbnail if available, else smallThumbnail, or fallback to a placeholder
  const imageUrl = volumeInfo.imageLinks?.medium || volumeInfo.imageLinks?.smallThumbnail;
  const placeholderImageUrl = '/placeholder-cover.png'; // Generated with Gemini to avoid copyright issues

  return (
    <Link
      href={`/book/${id}`}
      className="block border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out bg-white group"
    >
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100">
        <ClientImage
          src={imageUrl || placeholderImageUrl}
          fallbackSrc={placeholderImageUrl}
          alt={`Cover of ${title}`}
          fill // Makes the image fill the container
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" // To optimize image loading
          style={{ objectFit: 'contain' }} // Use 'contain' to see the whole cover, 'cover' to fill space
          className="group-hover:opacity-90 transition-opacity duration-200"
        />
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 truncate group-hover:text-blue-600" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 truncate" title={authors}>
          {authors}
        </p>
      </div>
    </Link>
  );
}