import { getAnnouncementBar } from "../services/announcement-bar.service";

export async function AnnouncementBar() {
  const bar = await getAnnouncementBar();

  if (!bar || !bar.isActive) return null;

  return (
    <div
      style={{ backgroundColor: bar.bgColor, color: bar.textColor }}
      className="w-full py-2 text-center text-sm font-medium tracking-wide"
      role="status"
    >
      {bar.text}
    </div>
  );
}
