import { getStatusColor, getStatusLabel } from "../../lib/utils";

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const label = customLabel || getStatusLabel(status);

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
