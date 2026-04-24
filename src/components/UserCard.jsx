import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import fallbackAvatarRaw from '../assets/fallback-avatar.svg?raw'
import { githubAPI } from '../api/githubClient'

const fallbackAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackAvatarRaw)}`

/**
 * Renders a single GitHub user card with avatar, username, and a profile link.
 *
 * ## Performance Notes
 *
 * ### React.memo — Preventing Re-renders (DOM Bloat Problem)
 * As the infinite scroll list grows to hundreds or thousands of items, every
 * state update (e.g. appending a new batch) would normally re-render ALL
 * mounted UserCard instances. `React.memo` with shallow comparison prevents
 * this: a card only re-renders if its `user` prop object reference changes,
 * which never happens for already-loaded users since we use functional state
 * updates (`setUsers(prev => [...prev, ...newBatch])`).
 *
 * ### content-visibility: auto — Reducing Paint Cost (applied on <li> in UserList)
 * The browser skips layout and paint for off-screen cards, treating them as
 * if they were `display: none` for rendering purposes while keeping them in
 * the DOM. `contain-intrinsic-size` gives the browser a size hint so the
 * scrollbar height stays stable and doesn't jump as cards are virtualized.
 * Together with React.memo, this addresses the "DOM Bloat" problem from two
 * directions: React skips JS re-renders, the browser skips GPU rasterization.
 *
 * @param {Object} props
 * @param {{ id: number, username: string, avatarUrl: string, profileUrl: string }} props.user
 */
function UserCardComponent({ user }) {
  return (
    <Card className="flex flex-col items-center text-center p-6 gap-4 h-full min-h-[200px] [box-shadow:0_0_6px_rgba(0,0,0,0.08)] ring-0 outline-none border-0">
      <div className="shrink-0 rounded-full p-1 bg-green-50">
        <img
          src={user.avatarUrl}
          alt={user.username}
          width={40}
          height={40}
          loading="lazy"
          className="!rounded-full bg-muted object-cover"
          style={{ width: 40, height: 40, minWidth: 40 }}
          onError={(e) => {
            const target = e.currentTarget;
            const githubUrl = githubAPI.getIdenticon(user.username);

            // Stop the loop if we are offline or already tried GitHub
            if (!navigator.onLine || target.src === githubUrl) {
              target.onerror = null;
              target.src = fallbackAvatar;
            } else {
              target.src = githubUrl;
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 w-full">
        <p className="font-semibold text-sm text-foreground truncate">
          {user.username}
        </p>
        <p className="text-xs text-muted-foreground">GitHub User</p>
      </div>
      <Button asChild className="w-full rounded-full bg-green-50 hover:!bg-green-100 text-green-700 hover:!text-green-800 border-none shadow-none" size="sm">
        <a
          href={user.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile
        </a>
      </Button>
    </Card>
  )
}

export const UserCard = memo(UserCardComponent)
