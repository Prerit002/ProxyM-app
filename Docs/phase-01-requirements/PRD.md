# ProxyM PRD

**Scope:** Android proxy management app (Flutter, Laravel, MySQL, Hostinger). 
**Target Users:** Users needing to manage, test, and organize HTTP/SOCKS proxies on Android.
**Core:** Proxy CRUD, testing (latency/status), groups, import/export. No VPN in MVP.
**Free Plan:** 5 proxies, basic testing, local storage, standard support.
**Premium Plan:** Unlimited proxies, bulk/advanced testing, cloud sync, proxy rotation, priority support.
**Storage:** Local SQLite/Hive for basic data, Secure Storage for passwords. Cloud sync to MySQL via REST API.
**Activation:** Option A (Proxy Manager Only) initially, to avoid VPN complexities and Play Store policy issues.
**Auth:** Email/Password via Laravel Sanctum.
**Billing:** Google Play Billing (server-side verification).
**Notifications:** Firebase Cloud Messaging (FCM).
**Support:** Real-time chat (provider TBD) + offline sync.
**Admin:** Next.js dashboard for user, proxy health, subscription, and chat management.
**Security:** Passwords encrypted at rest, no plain text logs, HTTPS only.
**Play Store:** Compliant with data safety, terms, and privacy policy.
