/* © 2017-2023 Booz Allen Hamilton Inc. All Rights Reserved. */

import "./InlinePopup.scss";

import * as React from "react";
import cx from "classnames";
import FocusLock from "react-focus-lock";
import { usePopupPosition } from "./utils";

interface InlinePopupProps {
  children: React.ReactNode;
  close: () => void;
  resetFocus: () => void;
  isOpen: boolean;
  shouldTrapFocus?: boolean;
  outsideId?: string;
}

export function InlinePopup({
  children,
  isOpen,
  close,
  resetFocus,
  shouldTrapFocus,
  outsideId,
}: InlinePopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   function logOffset() {
  //     if (popupRef.current) {
  //       const offset = getOffsets(popupRef.current);
  //       console.log(offset);
  //     }
  //     if (innerRef.current) {
  //       console.dir(innerRef.current);
  //     }
  //   }

  //   document.addEventListener("scroll", logOffset);

  //   return () => {
  //     document.removeEventListener("scroll", logOffset);
  //   };
  // }, []);

  const position = usePopupPosition({ popupRef, innerRef, isOpen });
  console.log("position", position);

  // Setup the keyboard and mouse event listeners
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === "Escape") {
        close();

        if (popupRef.current?.contains(event.target as Node)) {
          resetFocus();
        }
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (!popupRef.current) return; // It's already closed

      if (isOpen && !popupRef.current.contains(event.target as Node)) {
        close();
      }
    }

    function handleOutsideIdClick(event: MouseEvent) {
      if (!popupRef.current || !outsideId) return; // It's already closed

      const el = document.getElementById(outsideId);

      // If it's not in the DOM ignore
      if (!el) return;

      if (isOpen && !el.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mouseup", handleOutsideIdClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mouseup", handleOutsideIdClick);
    };
  }, [close, isOpen, outsideId, resetFocus]);

  return (
    <div
      ref={popupRef}
      data-component="inline-popup"
      style={{ position: "relative" }}
    >
      {isOpen ? (
        <div className={cx("sarsa--inline-popup", position)}>
          <div ref={innerRef} className="sarsa--inline-popup-children">
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
        </div>
      ) : null}
    </div>
  );
}
