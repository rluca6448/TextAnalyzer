import type { OptionField, OptionValue, WidgetOptions } from "@/widgets/types";

type Props = {
  schema: OptionField[];
  values: WidgetOptions;
  onChange: (key: string, value: OptionValue) => void;
};

/** Renders a form from a widget's options schema. Changes apply live. */
export default function OptionsForm({ schema, values, onChange }: Props) {
  return (
    <div className="ta-fields">
      {schema.map((f) => (
        <Field key={f.key} field={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} />
      ))}
    </div>
  );
}

type FieldProps = {
  field: OptionField;
  value: OptionValue;
  onChange: (value: OptionValue) => void;
};

function Field({ field: f, value, onChange }: FieldProps) {
  const id = `opt-${f.key}`;

  if (f.type === "boolean") {
    return (
      <label className="ta-field ta-field-inline" htmlFor={id}>
        <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        <span>{f.label}</span>
      </label>
    );
  }

  return (
    <div className="ta-field">
      <label htmlFor={id}>{f.label}</label>
      {f.type === "number" && (
        <input
          id={id}
          type="number"
          value={typeof value === "number" ? value : f.default}
          min={f.min}
          max={f.max}
          step={f.step}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            onChange(Number.isNaN(v) ? f.default : v);
          }}
        />
      )}
      {f.type === "select" && (
        <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {f.choices.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      )}
      {f.type === "text" && (
        <input id={id} type="text" value={String(value)} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
