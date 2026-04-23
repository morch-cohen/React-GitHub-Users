const BASE_URL = 'https://api.github.com'

export const githubAPI = {
  getUsers: (perPage, sinceId) =>
    `${BASE_URL}/users?per_page=${perPage}&since=${sinceId}`,
}
