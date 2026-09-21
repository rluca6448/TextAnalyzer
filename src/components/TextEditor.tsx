type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextEditor({ value, onChange }: Props) {
  return (
    <main className="ta-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or write your text here…"
        spellCheck
        aria-label="Text to analyze"
      />
    </main>
  );
}
