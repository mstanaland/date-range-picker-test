/* © 2017-2023 Booz Allen Hamilton Inc. All Rights Reserved. */

import "./InlinePopup.scss";

import * as React from "react";
import FocusLock from "react-focus-lock";

interface InlinePopupProps {
  children: React.ReactNode;
  close: () => void;
  resetFocus: () => void;
  isOpen: boolean;
  shouldTrapFocus?: boolean;
}

export function InlinePopup({
  children,
  isOpen,
  close,
  resetFocus,
  shouldTrapFocus,
}: InlinePopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);
  const previousOpenStateRef = React.useRef(isOpen);

  // React.useEffect(() => {
  //   console.log(document.activeElement);
  //   if (!isOpen && previousOpenStateRef.current) {
  //     // close();
  //     resetFocus();
  //     previousOpenStateRef.current = false;
  //   } else {
  //     previousOpenStateRef.current = isOpen;
  //   }
  // }, [close, isOpen, resetFocus]);

  // Setup the keyboard and mouse event listeners
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === "Escape") {
        close();
        previousOpenStateRef.current = false;

        if (popupRef.current?.contains(event.target as Node)) {
          resetFocus();
        }
      }
    }

    function handleClickOutside(event: MouseEvent) {
      console.log("click");
      if (!popupRef.current) return; // It's already closed

      if (isOpen && !popupRef.current.contains(event.target as Node)) {
        close();
        previousOpenStateRef.current = false;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [close, isOpen, resetFocus]);

  return isOpen ? (
    <div ref={popupRef} data-inline-popup className="sarsa--inline-popup">
      {shouldTrapFocus ? (
        <FocusLock>
          <button
            type="button"
            className="inline-popup-keyboard-close-btn"
            onClick={() => {
              close();
              resetFocus();
            }}
          >
            X
          </button>
          {children}
        </FocusLock>
      ) : (
        children
      )}
    </div>
  ) : null;
}
