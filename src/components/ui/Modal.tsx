"use client";

/**
 * Modal component with accessible markup, focus management, scroll locking, and open/close animations.
 *
 * Composable parts:
 *   <Modal>                  - context provider + state manager
 *   <ModalTrigger>           - any element that opens the modal
 *   <ModalContent>           - the dialog panel (backdrop + panel)
 *   <ModalHeader>            - top section with title/description
 *   <ModalTitle>             - h2 heading
 *   <ModalDescription>       - supporting text
 *   <ModalBody>              - scrollable content area
 *   <ModalFooter>            - action row at the bottom
 *   <ModalClose>             - any element that closes the modal
 *
 * Variants (on ModalContent):
 *   default | destructive | form | fullscreen
 *
 * Sizes (on ModalContent):
 *   sm | md | lg | xl | full
 *
 * Usage:
 * ```tsx
 * <Modal>
 *   <ModalTrigger asChild>
 *     <Button>Open</Button>
 *   </ModalTrigger>
 *   <ModalContent size="md" variant="default">
 *     <ModalHeader>
 *       <ModalTitle>Confirm action</ModalTitle>
 *       <ModalDescription>This cannot be undone.</ModalDescription>
 *     </ModalHeader>
 *     <ModalBody>...</ModalBody>
 *     <ModalFooter>
 *       <ModalClose asChild><Button variant="ghost">Cancel</Button></ModalClose>
 *       <Button>Continue</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 * ```
 */
import React, {
  type ComponentPropsWithoutRef,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

interface ModalContextValue {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx)
    throw new Error("Modal compound components must be used inside <Modal>");
  return ctx;
}

interface ModalProps {
  children: ReactNode;
  /** Control open state externally */
  open?: boolean;
  /** Called when modal requests close */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
}

function Modal({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const onOpen = useCallback(() => {
    if (!isControlled) setInternalOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const onClose = useCallback(() => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => {
    if (open) onClose();
    else onOpen();
  }, [open, onClose, onOpen]);

  return (
    <ModalContext.Provider value={{ open, onOpen, onClose, toggle }}>
      {children}
    </ModalContext.Provider>
  );
}

interface ModalTriggerProps extends ComponentPropsWithoutRef<"button"> {
  /** Pass true to merge props onto the direct child instead of wrapping */
  asChild?: boolean;
  children: ReactNode;
}

function ModalTrigger({
  asChild,
  children,
  className,
  ...props
}: ModalTriggerProps) {
  const { onOpen } = useModal();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        onClick: (e: React.MouseEvent) => {
          (
            children.props as Record<string, unknown> & {
              onClick?: (e: React.MouseEvent) => void;
            }
          ).onClick?.(e);
          onOpen();
        },
      }
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface ModalCloseProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children: ReactNode;
}

function ModalClose({
  asChild,
  children,
  className,
  ...props
}: ModalCloseProps) {
  const { onClose } = useModal();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        onClick: (e: React.MouseEvent) => {
          (
            children.props as Record<string, unknown> & {
              onClick?: (e: React.MouseEvent) => void;
            }
          ).onClick?.(e);
          onClose();
        },
      }
    );
  }

  return (
    <button
      type="button"
      onClick={onClose}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}

type ModalVariant = "default" | "destructive" | "form" | "fullscreen";
type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalContentProps extends ComponentPropsWithoutRef<"div"> {
  variant?: ModalVariant;
  size?: ModalSize;
  /** Close when clicking the backdrop. Defaults to true. */
  closeOnBackdropClick?: boolean;
  /** Close on Escape key. Defaults to true. */
  closeOnEscape?: boolean;
  children: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
};

const variantClasses: Record<ModalVariant, string> = {
  default: "border-gray-300",
  destructive: "border-destructive/40",
  form: "border-gray-300",
  fullscreen: "border-none rounded-none w-screen h-screen max-w-none",
};

function ModalContent({
  variant = "default",
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  children,
  className,
  ...props
}: ModalContentProps) {
  const { open, onClose } = useModal();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mount/unmount with animation timing
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Tiny delay ensures CSS transition fires after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeOnEscape, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!visible || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [visible]);

  if (!mounted) return null;

  const isFullscreen = variant === "fullscreen";

  return (
    // Portal-like: fixed overlay
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        isFullscreen ? "p-0" : "p-4"
      )}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-250",
          visible ? "opacity-100" : "opacity-0"
        )}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          // Base
          "relative z-10 w-full flex flex-col",
          "bg-white text-black",
          "border shadow-2xl",
          // Shape
          isFullscreen ? "rounded-none" : "rounded-2xl",
          // Variant
          variantClasses[variant],
          // Size
          !isFullscreen && sizeClasses[size],
          // Animation
          "transition-all duration-250",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]",
          className
        )}
        style={{
          transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
        }}
        {...props}
      >
        {/* Destructive accent line */}
        {variant === "destructive" && (
          <div className="absolute top-0 inset-x-0 h-1 bg-red-500 rounded-t-xl" />
        )}

        {/* Close button - always rendered in top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={cn(
            "absolute top-3.5 right-3.5 z-20",
            "inline-flex items-center justify-center",
            "w-7 h-7 rounded-md",
            "text-gray-500 hover:text-white",
            "hover:bg-primary-500 transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "cursor-pointer"
          )}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-4 pt-6 pb-4 pr-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalTitle({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

function ModalDescription({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("text-sm text-gray-500 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

function ModalBody({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto px-4 py-2",
        // Subtle scroll fade at top/bottom
        "[linear-gradient(to_bottom,transparent_0,black_1rem,black_calc(100%-1rem),transparent_100%)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalFooter({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2",
        "p-4",
        "border-t border-gray-300/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<"hr">) {
  return <hr className={cn("border-gray-300/60 mx-6", className)} {...props} />;
}

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalSeparator,
  useModal,
};

export type {
  ModalProps,
  ModalTriggerProps,
  ModalCloseProps,
  ModalContentProps,
  ModalVariant,
  ModalSize,
};
