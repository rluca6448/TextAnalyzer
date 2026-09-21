import { defineWidget } from "../types";
import FlowWidget, { type FlowOptions } from "./FlowWidget";

export default defineWidget<FlowOptions>({
  id: "flow",
  title: "Flow score",
  description: "How smoothly the text reads.",
  options: [
    {
      key: "scale",
      label: "Scale",
      type: "select",
      default: "percent",
      choices: [
        { value: "percent", label: "0-100" },
        { value: "ten", label: "0-10" },
      ],
    },
    { 
      key: "showTarget", 
      label: "Show target marker", 
      type: "boolean", 
      default: true 
    },
    { 
      key: "target", 
      label: "Target (%)", 
      type: "number", 
      default: 80, // Idealmente 80 para un buen hilo narrativo
      min: 0, 
      max: 100, 
      step: 5 
    },
  ],
  Component: FlowWidget,
});