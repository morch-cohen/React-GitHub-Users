import { RefreshCw, Loader2 } from 'lucide-react'

/**
 * Displays contextual status messages based on the current fetch/filter state.
 *
 * @param {Object} props
 * @param {boolean} props.loading - True if a fetch is in progress.
 * @param {string|null} props.error - Error message if the last fetch failed.
 * @param {boolean} props.hasMore - False when all users have been loaded.
 * @param {boolean} props.isEmpty - True when the filtered list is empty.
 * @param {number} props.usersCount - Total number of fetched users (unfiltered).
 * @param {Function} [props.onRetry] - Optional callback to retry the failed fetch.
 */
export function StatusMessage({ loading, error, hasMore, isEmpty, usersCount, onRetry }) {
  const fullPageLoading = loading && usersCount === 0;
  const paginationLoading = loading && usersCount > 0;
  const allLoaded = !hasMore && !loading && usersCount > 0;

  // Wrap the centered layout for reusability
  const Centered = ({ children }) => (
    <div className="flex items-center justify-center min-h-[20vh] py-8">
      {children}
    </div>
  );

  // Wrap the message style for reusability
  const Message = ({ children, variant = "muted" }) => (
    <p className={`text-center text-sm py-4 ${variant === "error" ? "text-destructive" : "text-muted-foreground"}`}>
      {children}
    </p>
  );

  // Simple, readable logic gate
  if (fullPageLoading) return <Centered><Message>Loading users...</Message></Centered>;
  if (paginationLoading) return (
    <div className="flex justify-center py-4">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
  if (error) return (
    <div className="w-full rounded-md bg-red-50 border border-red-200 px-4 py-3 flex items-center justify-between gap-2">
      <p className="text-sm text-red-600">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          aria-label="Retry"
          className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
  if (isEmpty) return <Centered><Message>No users found</Message></Centered>;
  if (allLoaded) return <Message>All users loaded</Message>;

  return null;
}
