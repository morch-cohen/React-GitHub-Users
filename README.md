# React GitHub Users Browser

A highly optimized, production-ready React application for browsing GitHub users with infinite scrolling, virtualization, and client-side filtering. 

[**Live GitHub Page**](https://morch-cohen.github.io/React-GitHub-Users/)

## Tech Stack
*Dependencies actually utilized in this project:*
- **React (`react`, `react-dom`)**: Core UI library.
- **Vite (`@vitejs/plugin-react`)**: Build tool and dev server.
- **Tailwind CSS (`tailwindcss`, `@tailwindcss/vite`)**: Utility-first CSS framework.
- **Shadcn UI (`shadcn`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`)**: Accessible component primitives and styling utilities.
- **React Virtuoso (`react-virtuoso`)**: High-performance virtualized list rendering.
- **Lucide React (`lucide-react`)**: SVG iconography.
- **Geist Font (`@fontsource-variable/geist`)**: Modern typeface.
- **Tailwind Animate (`tw-animate-css`)**: Animation utilities for Tailwind.

## Features
- **Infinite Scrolling via Virtualization**: Utilizes `react-virtuoso` (`VirtuosoGrid`) to render only the visible DOM nodes. It leverages `useWindowScroll` and an overscan of 300px to maintain buttery smooth scrolling without degrading browser performance (DOM Bloat) as the list grows.
- **Smart Filtering Behavior**: Includes a client-side text filter. **When the filter is active (not empty), all automatic pagination fetching is temporarily paused** to prevent unpredictable data jumps.
- **Contextual Loading States**:
  - *Initial Load*: Displays a centered "Loading users..." message when fetching the very first page (`usersCount === 0`).
  - *Subsequent Loads*: Displays a smaller "Loading more..." message at the bottom while appending new batches.
- **Robust Error Handling**: Distinctly handles GitHub API rate limits by catching `403` status codes and displaying: *"GitHub API rate limit exceeded. Please wait a moment and try again."* Provides a retry button for manual recovery.
- **Empty & Complete States**: Clearly informs the user when "No users found" (during filtering) or "All users loaded" (when the API returns fewer than the requested 10 users per page).

## Project Structure
```text
src/
├── api/
│   └── githubClient.js    - Configures base GitHub API URLs and standardizes headers.
├── components/
│   ├── FilterInput.jsx    - Controlled input component for capturing user search text.
│   ├── StatusMessage.jsx  - Pure UI component for contextual feedback (loading, error, etc).
│   ├── UserCard.jsx       - Memoized display component for individual users.
│   └── UserList.jsx       - Implements react-virtuoso grid to efficiently render user cards.
├── hooks/
│   └── useGithubUsers.js  - Custom hook dedicated exclusively to fetching and paginating.
└── App.jsx                - Main application component, manages local filter state and layout.
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Run the Development Server**
   ```bash
   npm run dev
   ```

## API Integration
- **Endpoint**: Fetches from `https://api.github.com/users?per_page=10&since={cursor}`.
- **Cursor Behavior**: Pagination is cursor-based. The `since` parameter is dynamically updated using the `id` of the last user returned in the previous batch.
- **Data Extracted**: The raw API payload is cleaned up to extract only `id`, `login` (mapped to `username`), `avatar_url`, and `html_url` (mapped to `profileUrl`).
- **Rate Limit**: Unauthenticated requests to this endpoint are severely rate-limited by GitHub (usually 60 requests/hour). When exceeded, the app halts fetching and displays a custom `403` error state.

## Architecture & Design Decisions

- **Why filter state lives in `App.jsx` and not in the hook**:  
  This enforcing a strict separation of concerns. `useGithubUsers` is entirely focused on data fetching and server state synchronization. The filter is a purely client-side UI derivation of that server state.
- **Why `useGithubUsers` returns only server state**:  
  By not polluting the hook with client-side text filtering logic, the hook remains highly reusable, predictable, and easier to test.
- **Why `isFetchingRef` is used alongside the `loading` state**:  
  React's `setState` (`setLoading`) is asynchronous. In rapid scroll scenarios, multiple fetch triggers might fire before the React state actually updates. `isFetchingRef` provides an immediate, synchronous lock to prevent duplicate network requests.
- **Why fetching is blocked when the filter is active**:  
  The GitHub `/users` endpoint does not accept text search parameters natively. Filtering the list locally shrinks the visible results. If scrolling down triggered another fetch during a search, the UI would abruptly jump as newly fetched users are evaluated against the local filter. 
- **Why `react-virtuoso` was chosen over a custom Sentinel approach**:  
  A custom Intersection Observer (Sentinel) at the bottom of the list triggers fetches effectively, but it leaves all previously loaded items in the DOM. With infinite scrolling, this leads to thousands of active DOM nodes ("DOM Bloat"), heavily degrading GPU and RAM performance. Virtuoso solves this by recycling DOM nodes for only the currently visible cards.

## Docker Deployment
The project includes a production-ready, multi-stage Docker build utilizing `node` for building and `nginx` for serving the static SPA.

```bash
docker build -t github-users-browser .
docker run -p 8080:80 github-users-browser
```

## Future Improvements
- **Authentication Token Support**: Exposing UI to inject a GitHub Personal Access Token to dramatically raise the API rate limit (from 60/hr to 5,000/hr).
- **Debounced Filter Input**: Wrapping the filter input with a debounce to prevent rapid, continuous re-evaluations of the memoized list during fast typing.
