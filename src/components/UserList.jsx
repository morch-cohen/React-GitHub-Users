import { VirtuosoGrid } from 'react-virtuoso'
import { UserCard } from '@/components/UserCard'
import { forwardRef } from 'react'

const GridList = forwardRef((props, ref) => (
  <div
    {...props}
    ref={ref}
    className="grid gap-8 list-none p-0 m-0"
    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', ...props.style }}
  />
))

const ItemContainer = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

/**
 * Renders a list of GitHub user cards using DOM virtualization.
 *
 * @param {Object} props
 * @param {Array} props.users - Array of user objects to display.
 * @param {Function} props.onEndReached - Callback when the user scrolls to the bottom.
 */
export function UserList({ users, onEndReached }) {
  return (
    <VirtuosoGrid
      data={users}
      endReached={onEndReached}
      overscan={300}
      useWindowScroll
      components={{
        List: GridList,
        Item: ItemContainer
      }}
      itemContent={(index, user) => <UserCard user={user} />}
    />
  )
}
