import { io } from 'socket.io-client';

// In development, Vite proxies /socket.io to the server (see vite.config.js).
// In production, the React build is served by the same Node.js server.
// In both cases, we use undefined (same-origin) so no CORS issues arise.
export const socket = io({
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
