import { createAuthClient } from 'better-auth/react';

type DemoAuthClient = ReturnType<typeof createAuthClient>;
type DemoSession = DemoAuthClient['$Infer']['Session'];

const STORAGE_KEY = 'demo-session';

let listeners: Array<() => void> = [];
let currentSession: DemoSession | null = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    parsed.user.createdAt = new Date(parsed.user.createdAt);
    parsed.user.updatedAt = new Date(parsed.user.updatedAt);
    parsed.session.expiresAt = new Date(parsed.session.expiresAt);
    parsed.session.createdAt = new Date(parsed.session.createdAt);
    parsed.session.updatedAt = new Date(parsed.session.updatedAt);

    return parsed as DemoSession;
  } catch {
    return null;
  }
})();

export function getSession(): DemoSession | null {
  return currentSession;
}

export function setSession(session: DemoSession | null): void {
  currentSession = session;

  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  for (const listener of listeners) {
    listener();
  }
}

export function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener];

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
