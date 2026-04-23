import { UserCard } from '@/components/UserCard'

/**
 * Renders a list of GitHub user cards and a scroll sentinel at the bottom.
 *
 * @param {Object} props
 * @param {Array} props.users - Array of user objects to display.
 * @param {React.RefObject} props.sentinelRef - Ref attached to the scroll sentinel div.
 */
export function UserList({ users, sentinelRef }) {
  return (
    <>
      <ul
        className="grid gap-8 list-none p-0 m-0"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}
      >
        {users.map((user) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} />
    </>
  )
}
