import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, id, className = "", ...rest }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label-caps text-[11px] text-graphite">
        {label}
      </label>
      <input
        id={id}
        className={`border px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-petrol ${
          error ? "border-red-500" : "border-mist"
        } ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
