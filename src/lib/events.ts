import { EventEmitter } from "events";

// Singleton EventEmitter for app-wide pub/sub (server-side)
const globalAny = globalThis as unknown as { __events?: EventEmitter };

export const events = globalAny.__events ?? new EventEmitter();
if (!globalAny.__events) {
  events.setMaxListeners(100);
  globalAny.__events = events;
}

export type AppEvent =
  | { type: "rate:created"; payload: { id: number } }
  | { type: "rate:updated"; payload: { id: number } }
  | { type: "rate:deleted"; payload: { id: number } };

export default events;
