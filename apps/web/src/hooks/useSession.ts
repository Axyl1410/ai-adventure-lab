import { useEffect, useState } from "react";
import { getOrCreateSession, type Session } from "../lib/api";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrCreateSession().then(setSession).catch((err) => setError(err.message));
  }, []);

  return { session, error };
}
