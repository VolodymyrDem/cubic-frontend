// src/lib/googleAuth.ts
import { config } from "@/config/runtime";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleAuthResponse {
  credential: string;
  clientId: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode?: "popup" | "redirect";
            state?: string;
            redirect_uri?: string;
            // If ux_mode is popup, we can get code via callback
            callback?: (response: { code?: string; error?: string }) => void;
            enable_serial_consent?: boolean;
            include_granted_scopes?: boolean;
          }) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}

// Завантажуємо Google Identity Services API
export const loadGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google API'));
    document.head.appendChild(script);
  });
};

// Ініціалізуємо Google OAuth
export const initializeGoogleAuth = async (): Promise<void> => {
  await loadGoogleAPI();
  
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not set');
  }

  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: false,
  });
};

// Обробляємо відповідь від Google OAuth
const handleCredentialResponse = (response: GoogleAuthResponse) => {
  // Цей колбек буде викликаний після успішної аутентифікації
  // Тут ми можемо відправити токен на бекенд для обробки
  console.log('Google OAuth response:', response);
  
  // Декодуємо JWT токен для отримання інформації про користувача
  const userInfo = parseJWT(response.credential);
  console.log('User info:', userInfo);
  
  // Відправляємо токен на бекенд
  sendTokenToBackend(response.credential);
};

// Парсимо JWT токен
const parseJWT = (token: string): GoogleUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload) as GoogleUser;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

// Відправляємо токен на бекенд
const sendTokenToBackend = async (credential: string) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Backend response:', data);
      
      // Після успіху бекенд має встановити httpOnly cookie сесії.
      // Перенаправляємо на обробник, який підтягне профіль і маршрутизує.
      window.location.href = '/auth/processing';
    } else {
      console.error('Backend authentication failed:', response.status);
    }
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
};

// Показуємо Google Sign-In кнопку
export const renderGoogleButton = (element: HTMLElement) => {
  if (!window.google?.accounts?.id) {
    console.error('Google API not loaded');
    return;
  }

  window.google.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    type: 'standard',
    text: 'signin_with',
    width: '100%',
  });
};

// Показуємо One Tap діалог
export const showOneTap = () => {
  if (!window.google?.accounts?.id) {
    console.error('Google API not loaded');
    return;
  }

  window.google.accounts.id.prompt();
};

// Відключаємо автовибір
export const disableAutoSelect = () => {
  if (!window.google?.accounts?.id) {
    console.error('Google API not loaded');
    return;
  }

  window.google.accounts.id.disableAutoSelect();
};

// Ініціюємо OAuth flow вручну (для прямого редиректу)
export const startGoogleOAuth = async () => {
  // Use GIS OAuth 2.0 Code flow with PKCE handled by Google client
  await loadGoogleAPI();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const redirectUri = (import.meta.env.VITE_GOOGLE_REDIRECT_URI as string | undefined)
    || `${window.location.origin}/auth/callback`;

  if (!clientId) throw new Error("VITE_GOOGLE_CLIENT_ID is not set");

  const scopes = [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.courses.readonly",
  ].join(" ");

  // Extract optional next path from current URL and persist it
  try {
    const u = new URL(window.location.href);
    const next = u.searchParams.get("next");
    if (next) sessionStorage.setItem("oauth_next", next);
  } catch {}

  // CSRF: generate and persist state for later verification in callback
  const state = Math.random().toString(36).slice(2);
  try {
    sessionStorage.setItem("oauth_state", state);
  } catch {}

  if (!window.google?.accounts?.oauth2) {
    // Fallback: classic redirect URL (no PKCE). Not recommended, but kept as backup.
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      include_granted_scopes: "true",
      state,
      prompt: "consent", // ensure refresh_token on first grant
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return;
  }

  const codeClient = window.google.accounts.oauth2.initCodeClient({
    client_id: clientId,
    scope: scopes,
    ux_mode: "redirect",
    redirect_uri: redirectUri,
    state,
    include_granted_scopes: true,
    enable_serial_consent: true,
  });

  codeClient.requestCode();
};