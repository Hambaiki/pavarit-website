import React from "react";
import ReactDOM from "react-dom";

interface AbsoluteChildContainerProps {
  isOpen: boolean;
  parentRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

const AbsoluteChildContainer = ({
  isOpen,
  parentRef,
  children,
}: AbsoluteChildContainerProps) => {
  if (!isOpen || !parentRef?.current) return null;

  // Get the position of the parent element
  const parentRect = parentRef.current.getBoundingClientRect();

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top: parentRect.bottom + window.scrollY,
        left: parentRect.left + window.scrollX,
        zIndex: 1000,
      }}
    >
      {children}
    </div>,
    document.body // Render into the body
  );
};

export default AbsoluteChildContainer;
