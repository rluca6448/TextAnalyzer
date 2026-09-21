/*
  WIDGET REGISTRY
  To add a widget:
    1. Copy a folder in widgets/ (e.g. widgets/flow) and rename it.
    2. Write your UI in the component and describe its options in index.ts.
    3. Import the definition here and add it to WIDGETS.

  The widget component receives { text, options }.
*/
import details from "./details";
import flow from "./flow";
import readability from "./readability";
import type { WidgetDefinition, WidgetOptions } from "./types";

export const WIDGETS: WidgetDefinition[] = [details, flow, readability ];

export const getWidget = (id: string) => WIDGETS.find((w) => w.id === id);

export const defaultsOf = (widget: WidgetDefinition): WidgetOptions =>
  Object.fromEntries(widget.options.map((f) => [f.key, f.default]));
