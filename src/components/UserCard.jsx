import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Renders a single GitHub user card with avatar, username, and a profile link.
 *
 * @param {Object} props
 * @param {{ id: number, username: string, avatarUrl: string, profileUrl: string }} props.user
 */
export function UserCard({ user }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <img
          src={user.avatarUrl}
          alt={user.username}
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />
        <span className="flex-1 truncate font-medium text-sm">
          {user.username}
        </span>
        <Button variant="link" asChild className="shrink-0 p-0">
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Profile
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
