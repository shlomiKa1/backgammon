import { useState } from "react";
import type { ActionResult } from "../types";

export function useAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<ActionResult>) => {
    setLoading(true);
    setError(null);

    const res = await action();
    setLoading(false);

    if (!res.success) setError(res.error.message);
  };

  return { run, loading, error };
}
