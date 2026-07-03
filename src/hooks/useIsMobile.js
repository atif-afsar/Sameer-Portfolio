import { useEffect, useState } from "react";

// A phone (or small touch device) gets the vertical layout. Desktop and larger
// laptops keep the horizontal panel experience. We treat narrow screens OR
// coarse-pointer devices up to tablet width as "mobile" so the vertical,
// natively-scrolling layout is used exactly where the horizontal one felt poor.
const WIDTH_QUERY = "(max-width: 767px)";
const COARSE_QUERY = "(pointer: coarse)";
const TABLET_QUERY = "(max-width: 1024px)";

function evaluate(widthMql, coarseMql, tabletMql) {
  return widthMql.matches || (coarseMql.matches && tabletMql.matches);
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return evaluate(
      window.matchMedia(WIDTH_QUERY),
      window.matchMedia(COARSE_QUERY),
      window.matchMedia(TABLET_QUERY)
    );
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const widthMql = window.matchMedia(WIDTH_QUERY);
    const coarseMql = window.matchMedia(COARSE_QUERY);
    const tabletMql = window.matchMedia(TABLET_QUERY);

    const update = () => setIsMobile(evaluate(widthMql, coarseMql, tabletMql));
    update();

    widthMql.addEventListener("change", update);
    coarseMql.addEventListener("change", update);
    tabletMql.addEventListener("change", update);

    return () => {
      widthMql.removeEventListener("change", update);
      coarseMql.removeEventListener("change", update);
      tabletMql.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;
