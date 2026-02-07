import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top first
    window.scrollTo({ top: 0, left: 0 });

    // If there's a hash (e.g., #mission), wait a bit then scroll to that element
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Use setTimeout to ensure the element is rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // 100ms is usually enough
      }
    }
  }, [pathname, hash]);

  return null;
}
