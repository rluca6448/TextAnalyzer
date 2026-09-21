import type { WidgetProps } from "../types";

import countWords from "@/functions/countWords";
import countCharacters from "@/functions/countCharacters";
import countSentences from "@/functions/countSentences";
import countParagraphs from "@/functions/countParagraphs";
import readingTime from "@/functions/readingTime";

export type DetailsOptions = {
  words: boolean;
  characters: boolean;
  sentences: boolean;
  paragraphs: boolean;
  readingTime: boolean;
};

// `text` is also available in props: ({ text, options })
export default function DetailsWidget({ text, options }: WidgetProps<DetailsOptions>) {
  const STATS: { key: keyof DetailsOptions; label: string; details: string }[] = [
    { key: "words", label: "Words", details: countWords(text).toString() },
    { key: "characters", label: "Characters", details: countCharacters(text).toString() },
    { key: "sentences", label: "Sentences", details: countSentences(text).toString() },
    { key: "paragraphs", label: "Paragraphs", details: countParagraphs(text).toString() },
    { key: "readingTime", label: "Reading time", details: readingTime(text) },
  ];

  const rows = STATS.filter((s) => options[s.key]);

  if (!rows.length) {
    return <p className="ta-muted">All stats are hidden. Enable some in the widget options.</p>;
  }

  return (
    <dl className="ta-stats">
      {rows.map((s) => (
        <div key={s.key} className="ta-stat">
          <dt>{s.label}</dt>
          <dd>{s.details}</dd>
        </div>
      ))}
    </dl>
  );
}
