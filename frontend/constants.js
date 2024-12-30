export const urlBase =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const urlPython =
  process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
export const alt = "Picture Outline Generator";
export const isDev = process.env.NODE_ENV === "development";
export const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB in bytes
