import { useState, useEffect, useCallback, useRef } from 'react'
import { githubAPI, getGithubHeaders } from '../api/githubClient'

const PER_PAGE = 10

/**
 * Custom hook to fetch and manage GitHub users with infinite scroll pagination.
 *
 * @returns {Object} result
 * @returns {Array<{id: number, username: string, avatarUrl: string, profileUrl: string}>} result.users - Array of mapped users.
 * @returns {boolean} result.loading - True if a fetch request is currently in progress.
 * @returns {string|null} result.error - The error message if the request fails, otherwise null.
 * @returns {boolean} result.hasMore - False if the last API batch returned fewer than 10 users.
 * @returns {Function} result.loadMore - Callback to trigger the next page of results.
 */
export function useGithubUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const sinceIdRef = useRef(0)
  const isFetchingRef = useRef(false)

  /**
   * Fetches the next batch of users from the GitHub API.
   * Prevents concurrent fetches and stops if no more users are available.
   */
  const fetchUsers = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return

    isFetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(githubAPI.getUsers(PER_PAGE, sinceIdRef.current), {
        headers: getGithubHeaders(),
      })

      if (!response.ok) {
        const err = new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        err.status = response.status
        throw err
      }

      const data = await response.json()

      const cleanData = data.map((user) => ({
        id: user.id,
        username: user.login,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
      }))

      setUsers((prev) => [...prev, ...cleanData])

      if (cleanData.length > 0) {
        sinceIdRef.current = cleanData[cleanData.length - 1].id
      }

      if (cleanData.length < PER_PAGE) {
        setHasMore(false)
      }
    } catch (err) {
      if (err.status === 403) {
        setError('GitHub API rate limit exceeded. Please wait a moment and try again.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [hasMore])

  /**
   * Stable callback to trigger more users to load.
   */
  const loadMore = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, error, hasMore, loadMore }
}
