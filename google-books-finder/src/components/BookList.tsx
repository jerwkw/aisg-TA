import { GBookItem } from '@/types/googleBooks';
import { BookCard } from './BookCard';

interface BookListProps {
  books: GBookItem[];
}

/**
 * Renders a grid of BookCard components based on the provided list of books.
 * Displays a message if the list is empty.
 * @param books - An array of GoogleBookItem objects.
 */
export function BookList({ books }: BookListProps) {
  if (!books || books.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No books found. Try a different search term.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}