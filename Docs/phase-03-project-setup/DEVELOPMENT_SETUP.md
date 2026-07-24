# ProxyM Development Setup

## Prerequisites
- Flutter SDK (for mobile app)
- PHP / Composer (for Laravel backend)
- Node.js / NPM or NPX (for Next.js admin)
- MySQL (for database)

## Running Locally

**Mobile (Flutter):**
```bash
cd mobile
flutter run
```

**Backend (Laravel):**
```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan serve
```

**Admin (Next.js):**
```bash
cd admin
npm run dev
```
