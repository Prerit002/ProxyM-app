# ProxyM App

ProxyM is a lightweight, high-performance proxy management tool designed with the "Ponytail" philosophy (minimal abstractions, maximum native framework utilization). 

It features a unified cross-platform architecture:
- **Mobile Client:** Flutter (Android/iOS)
- **Backend API:** Laravel 12 (PHP)
- **Database:** SQLite (MVP)

## Features
- 🚀 **Proxy Engine:** Custom string parsing to automatically extract IP, Port, Username, and Password from standard proxy strings (`192.168.1.1:8080:user:pass`).
- ⚡ **Real-time Latency Testing:** Test proxy speed and masking directly against `api.ipify.org`.
- 🔐 **Secure Authentication:** Powered by Laravel Sanctum and `flutter_secure_storage`.
- 📱 **Cross-Platform UI:** Built with standard Material 3 components for a seamless native feel.
- 📂 **Groups & Bulk Imports:** Organize proxies into folders or bulk import thousands at once.

## Getting Started

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. Mobile (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

## Architecture
- **State Management:** Riverpod (`flutter_riverpod`)
- **Routing:** GoRouter (`go_router`)
- **Networking:** Dio (`dio`) with interceptors for auth tokens.
- **Backend:** Laravel REST API utilizing resource controllers.

## Testing
To run the automated test suite for the proxy parsing engine and API routes:
```bash
cd backend
php artisan test
```

## Philosophy
Built by a "lazy senior developer"—the best code is the code never written. We avoided bloated third-party state managers on the backend and complex UI frameworks on the frontend in favor of native, standard-library implementations.
