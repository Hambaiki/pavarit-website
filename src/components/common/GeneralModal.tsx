import { ReactNode } from "react";

import Button from "../Button";
import ModalContainer from "../container/ModalContainer";

interface GeneralModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onClickPrimary?: () => void;
  onClickSecondary?: () => void;
  onClickOutside?: () => void;
}

function GeneralModal({
  visible,
  title,
  message,
  children,
  // Buttons
  primaryButtonText = "OK",
  secondaryButtonText = "Cancel",
  onClickPrimary,
  onClickSecondary,
  onClickOutside,
}: GeneralModalProps) {
  return (
    <ModalContainer
      visible={visible}
      onClickOutside={onClickOutside}
      className="p-4"
    >
      <div
        className="flex flex-col gap-6 p-4 rounded-xl w-full max-w-md
        bg-neutral-800 border border-gray-border"
      >
        <div className="flex flex-col gap-2">
          {title && <h2>{title}</h2>}
          {message && <p className="text-sm text-neutral-400">{message}</p>}
        </div>

        {children}

        {Boolean(onClickPrimary || onClickSecondary) && (
          <div className="flex gap-2">
            {onClickSecondary && (
              <Button
                variant="secondary"
                onClick={onClickSecondary}
                className="flex-1 p-2 h-10 rounded-full text-sm"
              >
                {secondaryButtonText}
              </Button>
            )}
            {onClickPrimary && (
              <Button
                variant="primary"
                onClick={onClickPrimary}
                className="flex-1 p-2 h-10 rounded-full text-sm"
              >
                {primaryButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}

export default GeneralModal;
