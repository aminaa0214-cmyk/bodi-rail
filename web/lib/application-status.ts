/** Ирсэн анкетын төлөв (applications.status) */
export const APPLICATION_STATUSES = [
  { value: "new", label: "Шинэ", className: "bg-sky text-blue-dark" },
  { value: "reviewed", label: "Хянасан", className: "bg-[#fff4e0] text-[#9a5b00]" },
  { value: "hired", label: "Ажилд авсан", className: "bg-[#e5f6ea] text-[#1b7a3a]" },
  { value: "rejected", label: "Татгалзсан", className: "bg-[#fdecea] text-[#c62828]" },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export function statusInfo(value: string) {
  return APPLICATION_STATUSES.find((s) => s.value === value) ?? APPLICATION_STATUSES[0];
}

export type ApplicationFile = { field: string; label: string; path: string; original_name: string; size: number; type: string };

export type ApplicationRow = {
  id: string;
  created_at: string;
  position: string;
  full_name: string;
  email: string;
  phone: string;
  register_no: string;
  answers: Record<string, unknown>;
  files: ApplicationFile[];
  status: ApplicationStatus;
  note: string | null;
};
