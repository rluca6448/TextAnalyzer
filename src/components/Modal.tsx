import type { ReactNode } from "react";

type Props = {
  label: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ label, onClose, children }: Props) {
  return (
    <div className="ta-backdrop" onMouseDown={onClose}>
      <div
        className="ta-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
