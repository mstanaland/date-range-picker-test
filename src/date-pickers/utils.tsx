import * as React from "react";
import { throttle } from "lodash";

export function getOffsets(node: Element) {
  const { top, height } = node.getBoundingClientRect();
  const { clientHeight } = document.documentElement;

  return {
    spaceAbove: top,
    spaceBelow: clientHeight - top - height,
  };
}

interface UsePopupPositionProps {
  popupRef: React.RefObject<HTMLDivElement>;
  innerRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
}

export function usePopupPosition({
  popupRef,
  innerRef,
  isOpen,
}: UsePopupPositionProps) {
  const BUFFER = 10;
  const [position, setPosition] = React.useState<"above" | "below">("below");

  const updatePosition = React.useCallback(() => {
    const popupEl = popupRef.current;
    const innerEl = innerRef.current;

    if (!isOpen || !popupEl || !innerEl) {
      return;
    }

    const { spaceAbove, spaceBelow } = getOffsets(popupEl);
    const contentHeight = innerEl.clientHeight + BUFFER;

    // If there isn't space below but there is above
    if (contentHeight > spaceBelow && contentHeight <= spaceAbove) {
      setPosition("above");
      return;
    }

    // If there's space below - be normal
    // If there isn't space above or below just be normal
    setPosition("below");
  }, [innerRef, isOpen, popupRef]);

  React.useLayoutEffect(() => {
    updatePosition();

    const throttledUpdatePosition = throttle(updatePosition, 200);

    document.addEventListener("scroll", throttledUpdatePosition);

    return () => {
      throttledUpdatePosition.cancel();
      document.removeEventListener("scroll", throttledUpdatePosition);
    };

    // document.addEventListener("scroll")
  }, [innerRef, isOpen, popupRef, updatePosition]);

  return position;
}
