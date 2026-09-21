import { defineWidget } from "../types";
import DetailsWidget, { type DetailsOptions } from "./DetailsWidget";

export default defineWidget<DetailsOptions>({
  id: "details",
  title: "Text details",
  description: "Counts for words, characters, sentences and more.",
  options: [
    { key: "words", label: "Words", type: "boolean", default: true },
    { key: "characters", label: "Characters", type: "boolean", default: true },
    { key: "sentences", label: "Sentences", type: "boolean", default: true },
    { key: "paragraphs", label: "Paragraphs", type: "boolean", default: true },
    { key: "readingTime", label: "Reading time", type: "boolean", default: false },
  ],
  Component: DetailsWidget,
});
