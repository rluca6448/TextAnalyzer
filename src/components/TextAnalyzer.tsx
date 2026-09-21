"use client";

import { useState } from "react";
import TextEditor from "./TextEditor";
import WidgetPanel from "./WidgetPanel";
import { useWidgets } from "@/hooks/useWidgets";
import "@/styles/text-analyzer.css";

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const widgets = useWidgets();

  return (
    <div className="ta">
      <TextEditor value={text} onChange={setText} />
      <WidgetPanel text={text} widgets={widgets} />
    </div>
  );
}
