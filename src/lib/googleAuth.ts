// src/lib/googleAuth.ts

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
const handleCredentialResponse = async (response: GoogleAuthResponse) => {
  // Цей колбек буде викликаний після успішної аутентифікації
  console.log('Google OAuth response received');
  
  // Декодуємо JWT токен для отримання інформації про користувача
  const userInfo = parseJWT(response.credential);
  console.log('User info:', userInfo);
  
  // Відправляємо токен на бекенд
  await sendTokenToBackend(response.credential);
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
    // Import authenticateWithGoogle from auth.ts
    const { authenticateWithGoogle } = await import('./auth');
    
    // First, try to authenticate without role (for existing users)
    try {
      const authResponse = await authenticateWithGoogle(credential);
      
      if (authResponse.needs_role_selection) {
        // New user - redirect to role selection
        sessionStorage.setItem('pending_google_token', credential);
        window.location.href = '/role-selection';
      } else {
        // Existing user - redirect to dashboard
        console.log('Authentication successful:', authResponse.user);
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      // If error is about missing role, redirect to role selection
      if (error.message?.includes('Role is required')) {
        sessionStorage.setItem('pending_google_token', credential);
        window.location.href = '/role-selection';
      } else {
        console.error('Authentication error:', error);
        alert('Помилка аутентифікації: ' + error.message);
      }
    }
  } catch (error) {
    console.error('Error sending token to backend:', error);
    alert('Помилка відправки токену на сервер');
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
  /**
   * Simple approach: Use Google Identity Services with ID token
   * This is more suitable for SPA without backend client secret
   */
  
  // Trigger the Google Sign-In flow
  await loadGoogleAPI();
  
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (!clientId) throw new Error("VITE_GOOGLE_CLIENT_ID is not set");
  
  // Initialize with callback
  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  
  // Show the One Tap dialog (simpler, no FedCM issues)
  try {
    window.google!.accounts.id.prompt();
  } catch (error) {
    console.error("Google One Tap failed:", error);
    // Fallback: user will need to click the button
  }
  
  /* 
  // Alternative: Authorization Code Flow (requires GOOGLE_CLIENT_SECRET on backend)
  await loadGoogleAPI();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const redirectUri = (import.meta.env.VITE_GOOGLE_REDIRECT_URI as string | undefined)
    || `${window.location.origin}/auth/callback`;

  if (!clientId) throw new Error("VITE_GOOGLE_CLIENT_ID is not set");

  const scopes = (import.meta.env.VITE_GOOGLE_SCOPES as string | undefined) || [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.courses.readonly",
  ].join(" ");

  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem("oauth_state", state);

  if (!window.google?.accounts?.oauth2) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes,
      access_type: "offline",
      include_granted_scopes: "true",
      state,
      prompt: "consent",
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
  */
};