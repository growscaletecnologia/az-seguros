export function formatToISO(date: any): string {
  if (!date) return "";
  try {
    if (typeof date === "string" && date.length === 10) return date;         // "2025-10-20"
    if (typeof date === "string" && date.includes("T")) return date.split("T")[0]; // ISO
    if (date instanceof Date) return date.toISOString().split("T")[0];
    if (date?.toDate) return date.toDate().toISOString().split("T")[0];
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return "";
  }
}
