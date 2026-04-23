import { useState, useMemo, useRef, useCallback } from 'react'
import { useGithubUsers } from '@/hooks/useGithubUsers'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
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

  // Sentinel ref for the IntersectionObserver
  const sentinelRef = useRef(null)

  // Guard: only load more if not already loading and there are more results
  const handleSentinelVisible = useCallback(() => {
    if (!loading && hasMore) loadMore()
  }, [loading, hasMore, loadMore])

  useIntersectionObserver(sentinelRef, handleSentinelVisible)

  const isEmpty = filterText.length > 0 && filteredUsers.length === 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">
      <FilterInput value={filterText} onChange={setFilterText} />
      <UserList users={filteredUsers} sentinelRef={sentinelRef} />
      <StatusMessage
        loading={loading}
        error={error}
        hasMore={hasMore}
        isEmpty={isEmpty}
        usersCount={users.length}
        onRetry={loadMore}
      />
    </div>
  )
}

export default App
