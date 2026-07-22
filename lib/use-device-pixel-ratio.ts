"use client";

import { useEffect, useState } from "react";

/**
 * Tracks window.devicePixelRatio, updating when the effective DPR changes
 * (window dragged to a monitor with a different density, or browser zoom).
 *
 * There is no DPR-change event, so this pins a matchMedia query to the
 * current value; when the DPR becomes anything else the query stops
 * matching, fires once, and a new query is armed against the new value.
 */
export function useDevicePixelRatio(): number {
  const [dpr, setDpr] = useState(() =>
    typeof window === "undefined" ? 1 : window.devicePixelRatio || 1
  );

  useEffect(() => {
    let mq: MediaQueryList | null = null;

    const onChange = () => {
      setDpr(window.devicePixelRatio || 1);
      arm();
    };

    const arm = () => {
      mq?.removeEventListener("change", onChange);
      mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mq.addEventListener("change", onChange, { once: true });
    };

    arm();
    return () => mq?.removeEventListener("change", onChange);
  }, []);

  return dpr;
}
