/* © 2017-2023 Booz Allen Hamilton Inc. All Rights Reserved. */

import * as React from "react";

interface TabFocusGuardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  close: () => void;
  isOpen: boolean;
}

export function TabFocusGuard({
  children,
  close,
  isOpen,
  ...rest
}: TabFocusGuardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  // Setup the keyboard and mouse event listeners
  React.useEffect(() => {
    function handleTabKey(event: KeyboardEvent) {
      if (!ref.current) return; // It's already closed

      if (event.key === "Tab") {
        const focusedElement = document.activeElement as HTMLElement;

        if (isOpen && !ref.current.contains(focusedElement)) {
          close();
        }
      }
    }

    document.addEventListener("keyup", handleTabKey);

    return () => {
      document.removeEventListener("keyup", handleTabKey);
    };
  }, [close, isOpen]);

  return (
    <div
      ref={ref}
      data-tab-focus-guard
      className="sarsa--tab-focus-guard"
      {...rest}
    >
      {children}
    </div>
  );
}
