import { defineWidget } from "../types";
import ReadabilityWidget, { type ReadabilityOptions } from "./ReadabilityWidget";

export default defineWidget<ReadabilityOptions>({
  id: "readability",
  title: "Readability score",
  description: "Calculates Spanish reading ease (Fernández Huerta).",
  options: [
    { 
      key: "scale", 
      label: "Scale", 
      type: "select", 
      default: "percent",
      choices: [
        { value: "percent", label: "Percent (0-100)" },
        { value: "ten", label: "Base 10 (0-10)" }
      ]
    },
    { 
      key: "showTarget", 
      label: "Show target", 
      type: "boolean", 
      default: true 
    },
    { 
      key: "target", 
      label: "Target score", 
      type: "number", 
      default: 70 
    },
  ],
  Component: ReadabilityWidget,
});