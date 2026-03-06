import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  className?: string;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor={id} className="text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`mt-1 text-base bg-white/20 border-white/30 text-white placeholder:text-white/60 pr-10 ${
          error && touched ? "border-red-500" : ""
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-8 text-white/60 hover:text-white"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
      {error && touched && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
