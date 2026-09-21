import type { ComponentType } from "react";

export type OptionValue = boolean | number | string;
export type WidgetOptions = Record<string, OptionValue>;

type BaseField = { key: string; label: string };

/** Schema of one option. The options form is generated from these. */
export type OptionField =
  | (BaseField & { type: "boolean"; default: boolean })
  | (BaseField & { type: "number"; default: number; min?: number; max?: number; step?: number })
  | (BaseField & { type: "select"; default: string; choices: { value: string; label: string }[] })
  | (BaseField & { type: "text"; default: string });

export type WidgetProps<O extends object = WidgetOptions> = {
  text: string;
  options: O;
};

export type WidgetDefinition = {
  id: string;
  title: string;
  description: string;
  options: OptionField[];
  Component: ComponentType<WidgetProps>;
};

/**
 * Lets each widget type its own options (e.g. `type FlowOptions = { target: number }`)
 * while the registry stores them all as generic WidgetDefinition.
 */
export function defineWidget<O extends object>(
  def: Omit<WidgetDefinition, "Component"> & { Component: ComponentType<WidgetProps<O>> }
): WidgetDefinition {
  return def as unknown as WidgetDefinition;
}
