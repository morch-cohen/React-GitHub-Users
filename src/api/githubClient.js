const BASE_URL = 'https://api.github.com'

/**
 * Returns request headers for GitHub API calls.
 * Includes Authorization if VITE_GITHUB_TOKEN is set in the environment.
 */
export function getGithubHeaders() {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const githubAPI = {
  getUsers: (perPage, sinceId) =>
    `${BASE_URL}/users?per_page=${perPage}&since=${sinceId}`,
}
