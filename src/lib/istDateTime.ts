const IST_TIME_ZONE = "Asia/Kolkata";

function getFormatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIME_ZONE,
    ...options,
  });
}

function getParts(date: Date) {
  const formatter = getFormatter({
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  ) as Record<"year" | "month" | "day" | "hour" | "minute", string>;

  return values;
}

export function getCurrentIstDateTimeLocalValue() {
  const { year, month, day, hour, minute } = getParts(new Date());
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function toIstDateTimeLocalValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 16).replace(" ", "T");
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return trimmed.slice(0, 16);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const { year, month, day, hour, minute } = getParts(parsed);
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function formatIstDateTimeLabel(value?: string | null) {
  if (!value) {
    return "";
  }

  const normalized = toIstDateTimeLocalValue(value);
  if (!normalized) {
    return "";
  }

  const [datePart, timePart] = normalized.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hourText, minute] = timePart.split(":");
  const hour = Number(hourText);

  const monthLabel = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    timeZone: IST_TIME_ZONE,
  }).format(new Date(Date.UTC(year, month - 1, day)));

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${monthLabel} ${day}, ${year} at ${String(hour12).padStart(2, "0")}:${minute} ${period}`;
}
