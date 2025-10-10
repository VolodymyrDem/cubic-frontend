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
      
      // Тут можна оновити стан аутентифікації в додатку
      // Наприклад, викликати refreshMe() з auth контексту
      window.location.href = '/'; // Перенаправляємо на головну сторінку
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
export const startGoogleOAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;
  
  const scopes = [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.students',
    'https://www.googleapis.com/auth/classroom.coursework.me',
    'https://www.googleapis.com/auth/classroom.courses.readonly'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    include_granted_scopes: 'true',
    state: Math.random().toString(36).substring(2, 15), // Генеруємо випадковий state
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  window.location.href = authUrl;
};