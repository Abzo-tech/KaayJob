import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  options,
  error,
  touched,
  required = false,
  disabled = false,
  className = "",
}: SelectInputProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={`mt-1 ${error && touched ? "border-red-500" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && touched && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
