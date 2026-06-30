import { useEffect } from "react";

const SITE_URL = "https://sameer-portfolio-dun.vercel.app";

function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Lightweight, dependency-free per-route SEO. Updates the document title,
 * description, canonical URL, and the key Open Graph / Twitter tags whenever a
 * route mounts. The static tags in index.html remain the crawl baseline; this
 * keeps secondary routes (e.g. /contact) accurate for JS-rendering crawlers.
 */
export default function Seo({ title, description, path = "/" }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    if (title) document.title = title;

    setMetaTag("name", "description", description);
    setCanonical(url);

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", url);

    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:url", url);
  }, [title, description, path]);

  return null;
}
