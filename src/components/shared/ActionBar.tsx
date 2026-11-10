import React, { useEffect, useRef, useState } from "react";

const isScrollable = (node: HTMLElement) => {
  const { overflowY } = getComputedStyle(node);
  return overflowY === "auto" || overflowY === "scroll";
};

/**
 * The dashboard content column: the nearest ancestor that actually scrolls,
 * or, when the page is too short to scroll, the nearest scrollable one.
 */
const findScrollContainer = (el: HTMLElement | null): HTMLElement | null => {
  const ancestors: HTMLElement[] = [];
  for (let node = el?.parentElement ?? null; node; node = node.parentElement) {
    if (isScrollable(node)) ancestors.push(node);
  }
  return (
    ancestors.find((node) => node.scrollHeight > node.clientHeight) ??
    ancestors[0] ??
    null
  );
};

interface ActionBarProps {
  children: React.ReactNode;
}

/**
 * A bar fixed to the bottom of the screen, lined up with the content column
 * (so it sits beside the sidebar and follows it when the sidebar collapses).
 * Leaves a spacer so the end of the page isn't hidden behind it.
 */
const ActionBar = ({ children }: ActionBarProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    let container: HTMLElement | null = null;
    const update = () => {
      container = findScrollContainer(anchorRef.current) ?? container;
      if (!container) {
        setBox(null);
        return;
      }
      const rect = container.getBoundingClientRect();
      // clientWidth leaves the container's scrollbar uncovered.
      setBox({
        left: rect.left + container.clientLeft,
        width: container.clientWidth,
      });
    };
    update();
    const observer = new ResizeObserver(update);
    if (container) observer.observe(container);
    if (anchorRef.current) observer.observe(anchorRef.current.parentElement!);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div ref={anchorRef} aria-hidden="true" className="h-24" />
      <div
        className="fixed bottom-0 z-30 border-t border-border bg-surface px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] lg:px-6"
        style={
          box ? { left: box.left, width: box.width } : { left: 0, right: 0 }
        }
      >
        {children}
      </div>
    </>
  );
};

export default ActionBar;
