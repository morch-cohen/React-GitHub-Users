import { useState, useMemo, useRef, useCallback } from 'react'
import { useGithubUsers } from '@/hooks/useGithubUsers'
import { UserList } from '@/components/UserList'
import { FilterInput } from '@/components/FilterInput'
import { StatusMessage } from '@/components/StatusMessage'

function App() {
  const { users, loading, error, hasMore, loadMore } = useGithubUsers()

  // Filter state lives in App, not in the hook
  const [filterText, setFilterText] = useState('')
  const filteredUsers = useMemo(
    () => users.filter((u) => u.username.toLowerCase().includes(filterText.toLowerCase())),
    [users, filterText]
  )

  // Guard: only load more if not already loading, there are more results, and filter is empty
  const handleEndReached = useCallback(() => {
    if (!loading && hasMore && filterText.trim() === '') loadMore()
  }, [loading, hasMore, loadMore, filterText])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width sticky header */}
      <header
        className="sticky top-0 z-10 w-full bg-green-50 px-4 py-4"
        style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.10)' }}
      >
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4 px-4">
          <h1 className="text-base font-semibold whitespace-nowrap text-foreground">
            GitHub Users Browser
          </h1>
          <div className="w-full">
            <FilterInput value={filterText} onChange={setFilterText} />
          </div>
          <div />
        </div>
      </header>

      {/* Scrollable content */}
      <div
        className="max-w-3xl mx-auto w-full flex flex-col gap-8 px-4 py-8"
        style={{ willChange: 'transform' }}
      >
        <UserList users={filteredUsers} onEndReached={handleEndReached} />
        <StatusMessage
          loading={loading}
          error={error}
          hasMore={hasMore}
          isEmpty={filteredUsers.length === 0}
          usersCount={users.length}
          onRetry={loadMore}
        />
      </div>
    </div>
  )
}

export default App
