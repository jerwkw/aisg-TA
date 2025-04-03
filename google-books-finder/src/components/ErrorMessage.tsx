interface ErrorMessageProps {
    message: string;
}
  
/**
 * Displays a formatted error message.
 * @param message - The error message text to display.
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{message}</span>
        </div>
    );
}