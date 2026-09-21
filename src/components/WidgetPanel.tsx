import { useState } from "react";
import WidgetCard from "./WidgetCard";
import WidgetsDialog from "./WidgetsDialog";
import { getWidget } from "@/widgets/registry";
import type { WidgetsState } from "@/hooks/useWidgets";

type Props = {
  text: string;
  widgets: WidgetsState;
};

export default function WidgetPanel({ text, widgets }: Props) {
  const { active, options, toggle } = widgets;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <aside className="ta-panel">
      <header className="ta-panel-head">
        <h1>Analysis</h1>
        <button
          type="button"
          className="ta-btn ta-btn-primary"
          aria-haspopup="dialog"
          onClick={() => setDialogOpen(true)}
        >
          Widgets ({active.length})
        </button>
      </header>

      <div className="ta-widgets">
        {active.length === 0 && <p className="ta-empty">No widgets yet. Open Widgets to add one.</p>}
        {active.map((id) => {
          const widget = getWidget(id);
          if (!widget) return null;
          return (
            <WidgetCard key={id} title={widget.title} onRemove={() => toggle(id)}>
              <widget.Component text={text} options={options[id]} />
            </WidgetCard>
          );
        })}
      </div>

      {dialogOpen && <WidgetsDialog widgets={widgets} onClose={() => setDialogOpen(false)} />}
    </aside>
  );
}
