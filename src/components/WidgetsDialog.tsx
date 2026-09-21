import { useEffect, useState } from "react";
import Modal from "./Modal";
import OptionsForm from "./OptionsForm";
import { WIDGETS, getWidget } from "@/widgets/registry";
import type { WidgetsState } from "@/hooks/useWidgets";

type Props = {
  widgets: WidgetsState;
  onClose: () => void;
};

/**
 * One popup with two views:
 *   "list"   -> pick which widgets are shown
 *   <id>     -> edit the options of that widget
 */
export default function WidgetsDialog({ widgets, onClose }: Props) {
  const { active, options, toggle, setOption, resetOptions } = widgets;
  const [view, setView] = useState<string>("list");
  const editing = view === "list" ? undefined : getWidget(view);

  // Esc: options -> list -> closed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (view === "list") onClose();
      else setView("list");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, onClose]);

  return (
    <Modal label={editing ? `${editing.title} options` : "Widgets"} onClose={onClose}>
      {!editing ? (
        <>
          <h2>Widgets</h2>
          <div className="ta-picker">
            {WIDGETS.map((w) => (
              <div key={w.id} className="ta-picker-row">
                <label className="ta-picker-main">
                  <input type="checkbox" checked={active.includes(w.id)} onChange={() => toggle(w.id)} />
                  <span>
                    <strong>{w.title}</strong>
                    <small>{w.description}</small>
                  </span>
                </label>
                <button
                  type="button"
                  className="ta-btn"
                  onClick={() => setView(w.id)}
                  aria-label={`Edit options for ${w.title}`}
                >
                  Options
                </button>
              </div>
            ))}
          </div>
          <footer className="ta-dialog-end">
            <button type="button" className="ta-btn ta-btn-primary" onClick={onClose}>
              Done
            </button>
          </footer>
        </>
      ) : (
        <>
          <h2>{editing.title} options</h2>
          <OptionsForm
            schema={editing.options}
            values={options[editing.id]}
            onChange={(key, value) => setOption(editing.id, key, value)}
          />
          <footer>
            <button type="button" className="ta-btn" onClick={() => resetOptions(editing.id)}>
              Reset to defaults
            </button>
            <button type="button" className="ta-btn ta-btn-primary" onClick={() => setView("list")}>
              Back to widgets
            </button>
          </footer>
        </>
      )}
    </Modal>
  );
}
