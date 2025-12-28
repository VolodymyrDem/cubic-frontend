# Налаштування GitHub Pages

## Автоматичний деплой

1. **Налаштуйте GitHub Pages в репозиторії:**
   - Йдіть в Settings → Pages
   - Source: виберіть "GitHub Actions"

2. **Оновіть конфігурацію:**
   - Відредагуйте `public/config.js` з правильними production значеннями
   - Особливо важливо:
     - `API_BASE_URL` - ваш production API
     - `DEV_AUTH` - встановіть `"0"` для production
     - `GOOGLE_REDIRECT_URI` - має бути GitHub Pages URL

3. **Запуште код в main:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push origin main
   ```

4. **Workflow автоматично запуститься** і задеплоїть ваш сайт на:
   `https://poliukhovych.github.io/cubic-frontend/`

## Локальна розробка

Для локальної розробки використовується `.env.development`:
```bash
npm run dev
```

Він буде використовувати `localhost:8000` як API та DEV_AUTH режим.

## Production білд локально

Якщо потрібно перевірити production білд локально:
```bash
npm run build
npm run preview
```

## Важливо

- **НЕ коммітьте** `.env` файли з секретами!
- `.env.development` та `.env.production` - це шаблони
- Реальна конфігурація для GitHub Pages - в `public/config.js`
- Система пріоритетів: `window.__APP_CONFIG__` > `VITE_` змінні

## Перемикання між dev та production

### Development (локально):
- `config.js` не використовується
- Використовується `.env.development` через VITE_ змінні
- DEV_AUTH увімкнений

### Production (GitHub Pages):
- Використовується `public/config.js`
- `.env` файли не доступні
- DEV_AUTH має бути вимкнений
