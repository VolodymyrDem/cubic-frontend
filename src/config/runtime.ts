// src/config/runtime.ts
type RuntimeConfig = {
  API_BASE_URL: string;
};

declare global {
  interface Window {
    __CONFIG__?: Partial<RuntimeConfig>;
  }
}

const defaultConfig: RuntimeConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
};

export const config: RuntimeConfig = {
  ...defaultConfig,
  ...(window.__CONFIG__ || {}),
};
