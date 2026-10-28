import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-1521514346848136";

/**
 * Renders a single Google AdSense unit.
 *
 * Defensive by design so a slow/blocked/failed ad script can never break the
 * surrounding page:
 *  - Only pushes to `window.adsbygoogle` once per mounted <ins>, guarded by a
 *    ref (this project runs in reactStrictMode, which double-invokes effects
 *    in development — without this guard AdSense logs a "already have ads
 *    in them" console error, or worse, on every reload).
 *  - Wrapped in try/catch: ad blockers, network failures, or the script not
 *    having loaded yet all throw synchronously from `.push()`, and none of
 *    that should ever propagate into the application, let alone the
 *    application form itself.
 *  - Reserves layout space via the wrapper's min-height so the page doesn't
 *    jump when the ad finally renders (or collapse if it never does).
 */
export default function AdUnit({
  slot,
  format = "auto",
  fullWidthResponsive = true,
  layout,
  style,
  label = "Advertisement",
  className = "",
}) {
  const insRef = useRef(null);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    if (typeof window === "undefined") return;

    const el = insRef.current;
    // If this <ins> already has an ad rendered into it (e.g. strict-mode
    // double effect, or fast refresh re-running this effect), don't ask
    // AdSense to fill it again.
    if (el && el.getAttribute("data-adsbygoogle-status")) {
      requested.current = true;
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      requested.current = true;
    } catch (err) {
      // Ad blocked, script not loaded yet, or offline - fail silently.
      console.warn("AdSense: ad request failed", err);
    }
  }, []);

  return (
    <div className={`ad-slot ${className}`.trim()}>
      {label && <span className="ad-slot-label">{label}</span>}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
      />
    </div>
  );
}
