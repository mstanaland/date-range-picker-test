import * as React from "react";
import { throttle } from "lodash";

const visualViewport =
  typeof document !== "undefined" ? window.visualViewport : null;

export function getOffsets(node: Element) {
  const { top, height, left, width } = node.getBoundingClientRect();
  const { clientHeight, clientWidth } = document.documentElement;

  return {
    spaceAbove: top,
    spaceBelow: clientHeight - top - height,
    spaceRight: clientWidth - left - width,
    width,
  };
}

interface UsePopupPositionProps {
  popupRef: React.RefObject<HTMLDivElement>;
  innerRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
}

type Position = "above left" | "above right" | "below left" | "below right";

export function usePopupPosition({
  popupRef,
  innerRef,
  isOpen,
}: UsePopupPositionProps) {
  const BUFFER = 10;
  const [position, setPosition] = React.useState<Position>("below left");

  const updatePosition = React.useCallback(() => {
    const popupEl = popupRef.current;
    const innerEl = innerRef.current;

    if (!isOpen || !popupEl || !innerEl) {
      return;
    }

    const { spaceAbove, spaceBelow, spaceRight, width } = getOffsets(popupEl);
    const contentHeight = innerEl.clientHeight + BUFFER;
    const pokeyOutWidth = innerEl.clientWidth - width + BUFFER; // how much the popup extends beyond input

    // If there isn't space below but there is above
    if (contentHeight > spaceBelow && contentHeight <= spaceAbove) {
      if (pokeyOutWidth > spaceRight) {
        setPosition("above right");
      } else {
        setPosition("above left");
      }
      return;
    }

    // If there's space below - be normal
    // If there isn't space above or below just be normal
    if (pokeyOutWidth > spaceRight) {
      setPosition("below right");
    } else {
      setPosition("below left");
    }
  }, [innerRef, isOpen, popupRef]);

  React.useLayoutEffect(() => {
    updatePosition();

    const throttledUpdatePosition = throttle(updatePosition, 150);

    document?.addEventListener("scroll", throttledUpdatePosition);
    visualViewport?.addEventListener("resize", throttledUpdatePosition);

    return () => {
      throttledUpdatePosition.cancel();
      document?.removeEventListener("scroll", throttledUpdatePosition);
      visualViewport?.removeEventListener("resize", throttledUpdatePosition);
    };

    // document.addEventListener("scroll")
  }, [innerRef, isOpen, popupRef, updatePosition]);

  return position;
}
