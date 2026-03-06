import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface EmailInputProps {
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
  className?: string;
}

export function EmailInput({
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
  className = "",
}: EmailInputProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`mt-1 text-base bg-white/20 border-white/30 text-white placeholder:text-white/60 ${
          error && touched ? "border-red-500" : ""
        } ${disabled ? "opacity-50" : ""}`}
      />
      {error && touched && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
