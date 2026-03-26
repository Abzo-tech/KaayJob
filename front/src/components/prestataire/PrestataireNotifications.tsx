import { NotificationDropdown } from "../common/NotificationDropdown";

export function PrestataireNotifications() {
  return (
    <div className="fixed top-4 left-[calc(100%-5rem)] z-50">
      <NotificationDropdown variant="light" align="left" />
    </div>
  );
}