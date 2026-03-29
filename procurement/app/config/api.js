// API configuration shared across the app.
// Falls back to the deployed backend when NEXT_PUBLIC_API_URL is not set.
const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://procurement-system-1-mzqc.onrender.com";
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");

export default API_BASE_URL;
