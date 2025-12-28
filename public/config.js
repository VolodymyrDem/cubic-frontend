// Конфігурація для GitHub Pages (production)
// Це буде використовуватися замість .env файлів
window.__APP_CONFIG__ = {
  APP_BASE_PATH: "/cubic-frontend", // Ваша назва репо на GitHub Pages
  API_BASE_URL: "http://localhost:8000", // Змініть на production API URL
  GOOGLE_CLIENT_ID: "156322397230-dloj26s348rut4u70e8r6h6680m0abjh.apps.googleusercontent.com",
  GOOGLE_REDIRECT_URI: "https://volodymyrdem.github.io/cubic-frontend/auth/callback", // GitHub Pages URL
  GOOGLE_USE_CODE_FLOW: "1",
  DEV_AUTH: "1", // Встановіть "0" для production
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "admin123"
};
