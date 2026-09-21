import { useState } from "react";
import { WIDGETS, defaultsOf, getWidget } from "@/widgets/registry";
import type { OptionValue, WidgetOptions } from "@/widgets/types";

const INITIAL_ACTIVE = ["details", "flow"];

/** Which widgets are shown (in order) and the current options of every widget. */
export function useWidgets() {
  const [active, setActive] = useState<string[]>(INITIAL_ACTIVE);
  const [options, setOptions] = useState<Record<string, WidgetOptions>>(() =>
    Object.fromEntries(WIDGETS.map((w) => [w.id, defaultsOf(w)]))
  );

  const toggle = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const setOption = (id: string, key: string, value: OptionValue) =>
    setOptions((o) => ({ ...o, [id]: { ...o[id], [key]: value } }));

  const resetOptions = (id: string) => {
    const widget = getWidget(id);
    if (widget) setOptions((o) => ({ ...o, [id]: defaultsOf(widget) }));
  };

  return { active, options, toggle, setOption, resetOptions };
}

export type WidgetsState = ReturnType<typeof useWidgets>;
