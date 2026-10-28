import "@/styles/globals.css";
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/*
        AdSense loader script, shared across every page.
        - next/script (not a raw <script> tag) so Next manages/dedupes it
          without interfering with hydration.
        - strategy="afterInteractive" loads it once the page is interactive,
          so it never competes with or delays the application form.
        - onError just logs; a failed/blocked ad script must never crash
          the app, it only means ad slots stay empty.
      */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1521514346848136"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onError={(err) => console.warn("AdSense script failed to load", err)}
      />
      <Component {...pageProps} />
    </>
  );
}
