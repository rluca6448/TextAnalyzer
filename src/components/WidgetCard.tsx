import type { ReactNode } from "react";

type Props = {
  title: string;
  onRemove: () => void;
  children: ReactNode;
};

export default function WidgetCard({ title, onRemove, children }: Props) {
  return (
    <section className="ta-card">
      <header>
        <h2>{title}</h2>
        <button type="button" className="ta-icon-btn" onClick={onRemove} aria-label={`Remove ${title}`}>
          ×
        </button>
      </header>
      {children}
    </section>
  );
}
