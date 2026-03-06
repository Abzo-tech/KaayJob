import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  rows = 4,
  className = "",
}: TextAreaProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={`mt-1 ${error && touched ? "border-red-500" : ""} ${disabled ? "opacity-50" : ""}`}
      />
      {error && touched && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
