import { $, Observable, useEffect } from "voby";

export const useMediaQuery = (breakpoint?: string): Observable<boolean> => {
  const matches = $(
    !!breakpoint && window.matchMedia(breakpoint).matches,
  );

  useEffect(() => {
    if (breakpoint) {
      const media = window.matchMedia(breakpoint);

      const handleMatch = () => {
        if (media.matches !== matches()) {
          $(media.matches);
        }
      };

      handleMatch();

      media.addEventListener('change', handleMatch);
      return () => media.removeEventListener('change', handleMatch);
    }
  });

  return matches;
};
