/**
 * Marks an element that scrolls page content (the dashboard layout scrolls
 * inside its own containers, not the window).
 */
export const SCROLL_CONTAINER_PROPS = { "data-scroll-container": "" } as const;

/** Scroll the window and every marked scroll container back to the top. */
export const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0 });
  document
    .querySelectorAll<HTMLElement>("[data-scroll-container]")
    .forEach((el) => {
      el.scrollTop = 0;
    });
};
