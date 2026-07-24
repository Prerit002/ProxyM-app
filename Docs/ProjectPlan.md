# ProxyM — Complete Project Development Plan

**Project:** ProxyM
**Platform:** Android
**Mobile Framework:** Flutter / Dart
**Backend:** Laravel / PHP
**Database:** MySQL
**Admin Panel:** Next.js + TypeScript + Tailwind CSS
**Hosting:** Hostinger Premium Web Hosting
**Authentication:** Laravel Sanctum
**Push Notifications:** Firebase Cloud Messaging (FCM)
**Real-Time Chat:** Dedicated real-time messaging service / WebSocket-compatible service
**VPN:** Not included in MVP
**Redis:** Not required for MVP
**Primary Goal:** Build, test, deploy, and publish ProxyM as a production-ready Android proxy management application on Google Play Store.

---

# 1. Project Vision

ProxyM is an Android proxy management application that allows users to manage, organize, test, and use supported proxy configurations.

The initial MVP will focus on:

* Proxy management
* Proxy testing
* Account management
* Cloud synchronization
* Free and Premium plans
* Push notifications
* Real-time customer support chat
* Admin management

A full-device VPN feature is **not included in the initial MVP**.

---

# 2. Core Features

Users should be able to:

* Add proxies
* Edit proxies
* Delete proxies
* Store proxy credentials securely
* Test proxy availability
* Check proxy latency
* Check connection status
* Detect proxy IP
* Detect country
* Detect ISP where technically possible
* Import proxy lists
* Export proxy lists
* Search proxies
* Filter proxies
* Sort proxies
* Organize proxies into groups
* Test individual proxies
* Test multiple proxies
* Manage Free and Premium features
* Create an account
* Sync supported data with backend
* Manage subscriptions
* Receive real-time notifications
* Receive push notifications
* Contact customer support through real-time chat
* View support chat history
* Manage account settings

---

# 3. Supported Proxy Protocols

ProxyM should support:

* HTTP
* HTTPS
* SOCKS4
* SOCKS5

---

# 4. Supported Proxy Formats

Initial supported formats:

```text
IP:PORT

IP:PORT:USERNAME:PASSWORD

USERNAME:PASSWORD@IP:PORT
```

The parser must be designed so additional formats can be added later.

---

# 5. System Architecture

The initial architecture:

```text
                         ProxyM Flutter App
                                │
                                │ HTTPS REST API
                                ▼
                    ┌─────────────────────────┐
                    │     Laravel Backend     │
                    │          PHP            │
                    │                         │
                    │ Authentication          │
                    │ Proxy Management        │
                    │ Proxy Testing            │
                    │ Import / Export         │
                    │ Subscription API        │
                    │ Notification API        │
                    │ Chat API                │
                    │ User Management         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                         Hostinger MySQL
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
       Admin Panel          Firebase FCM       Real-Time Chat
       Next.js              Push Service       Service
       TypeScript                 │                   │
       Tailwind                   │                   │
             │                    │                   │
             ▼                    ▼                   ▼
        Admin Users         Android Push        Live Messages
```

---

# 6. Future Scalable Architecture

If proxy testing or real-time infrastructure becomes resource-intensive:

```text
                         ProxyM Flutter App
                                │
                                ▼
                         Laravel REST API
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
            MySQL        Proxy Worker       Real-Time Service
                              │                    │
                              │                    │
                    ┌─────────┴─────────┐          │
                    │                   │          │
                    ▼                   ▼          ▼
                  HTTP              SOCKS4      Live Chat
                  HTTPS             SOCKS5      Messages
```

The proxy worker service may later run on:

* Hostinger VPS
* Separate VPS
* Cloud server
* Dedicated worker infrastructure

The real-time chat system may later use:

* WebSocket infrastructure
* Managed real-time messaging service
* Firebase-based real-time communication
* Other scalable real-time provider

The MVP must not require expensive infrastructure unless actual requirements justify it.

---

# 7. Technology Stack

## Mobile Application

```text
Flutter
Dart
Riverpod
Dio
GoRouter
Hive or SQLite
Flutter Secure Storage
Firebase Cloud Messaging
```

## Backend

```text
PHP
Laravel
Laravel Sanctum
Eloquent ORM
Laravel Validation
Laravel API Resources
Laravel Migrations
Laravel Queues (only if supported/required)
```

## Database

```text
MySQL
```

## Admin Panel

```text
Next.js
TypeScript
Tailwind CSS
```

## Notifications

```text
Firebase Cloud Messaging (FCM)
```

## Real-Time Chat

```text
Real-Time Messaging Service
or
WebSocket-Compatible Infrastructure
```

The exact provider must be selected during the real-time communication phase based on:

* Cost
* Hostinger compatibility
* Scalability
* Flutter support
* Laravel support
* Security
* Reliability

## Hosting

```text
Hostinger Premium Web Hosting
```

## Infrastructure

```text
Redis: Not required initially
Docker: Not required initially
VPS: Not required initially
```

---

# 8. Important Development Rules for AI Agents

These rules are mandatory.

## Rule 1 — Read Documentation First

Before starting work, the AI agent must read:

```text
PROJECT_PLAN.md
```

Then read the assigned phase:

```text
docs/phase-XX-name/progress.md
```

The agent must inspect the existing codebase before making changes.

Do not overwrite existing working functionality without a documented reason.

---

## Rule 2 — One Phase at a Time

An AI agent must work only on the assigned phase.

Do not automatically start the next phase.

Example:

```text
Phase 01 → Complete
Phase 02 → Start only after Phase 01 verification
```

---

## Rule 3 — Every Phase Requires progress.md

Every phase must contain:

```text
progress.md
```

If it does not exist, the AI agent must create it before implementation.

A phase without `progress.md` is considered incomplete.

---

## Rule 4 — Never Delete Progress History

AI agents must not reset or delete previous progress.

New work must be added with:

* Date
* Changes
* Files created
* Files modified
* Tests
* Issues
* Decisions

---

## Rule 5 — Do Not Assume Completion

Writing code does not mean the phase is complete.

A phase can only be marked `COMPLETED` after:

* Implementation is complete
* Tests are performed
* Critical errors are resolved
* Documentation is updated
* `progress.md` is updated
* Final verification is completed

---

## Rule 6 — Stop After Assigned Phase

After completing the assigned phase, the AI agent must stop.

It must not automatically begin the next phase.

---

# 9. Progress File Standard

Every phase must use this structure:

```markdown
# Phase XX — Progress

## Phase Information

- Phase:
- Status: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED
- Started:
- Last Updated:
- Completed By:

---

## Objectives

- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

---

## Completed Work

- 

---

## Files Created

- 

---

## Files Modified

- 

---

## Tests Performed

- 

---

## Test Results

- 

---

## Issues / Blockers

- None

---

## Decisions Made

- 

---

## Remaining Work

- 

---

## Next Steps

- 

---

## Final Verification

- [ ] Code builds successfully
- [ ] Tests pass
- [ ] No critical errors
- [ ] Documentation updated
- [ ] Progress file updated
```

The AI agent must update `progress.md` before finishing its task.

---

# 10. Phase 01 — Requirements & Product Specification

## Objective

Finalize the exact ProxyM product scope before development.

## Tasks

* Define product scope
* Define target users
* Define Free plan
* Define Premium plan
* Define supported proxy types
* Define proxy formats
* Define authentication requirements
* Define local storage strategy
* Define cloud storage strategy
* Define proxy testing functionality
* Define import/export functionality
* Define proxy activation strategy
* Define subscription requirements
* Define admin requirements
* Define notification requirements
* Define real-time chat requirements
* Define privacy requirements
* Define security requirements
* Define Google Play requirements

## Deliverables

```text
docs/phase-01-requirements/
├── PRD.md
├── FEATURE_LIST.md
├── USER_FLOWS.md
└── progress.md
```

## Completion Criteria

* Product scope finalized
* Features documented
* Technical limitations documented
* Proxy activation strategy documented
* Free/Premium features documented
* Data storage strategy documented
* Notification strategy documented
* Chat support strategy documented

---

# 11. Phase 02 — UI/UX Design

## Objective

Design the complete ProxyM mobile application.

## Screens

### Onboarding

* Splash
* Welcome
* Feature introduction

### Authentication

* Login
* Register
* Forgot password
* Reset password
* Email verification

### Home

* Active proxy
* Connection status
* Current IP
* Proxy type
* Quick actions
* Recent proxies

### Proxy Management

* Proxy list
* Add proxy
* Edit proxy
* Delete proxy
* Search
* Filter
* Sort
* Proxy groups

### Proxy Testing

* Single proxy test
* Bulk proxy testing
* Latency
* Status
* IP
* Country
* ISP

### Import / Export

* Import TXT
* Import CSV
* Paste proxy list
* Export TXT
* Export CSV

### Premium

* Free plan
* Premium plan
* Feature comparison
* Subscription

### Notifications

* Notification center
* Notification details
* Read/unread state
* Mark all as read
* Notification preferences

### Support Chat

* Support center
* New conversation
* Chat list
* Real-time conversation
* Message status
* Read status
* Attachment upload
* Close conversation
* Reopen conversation
* Chat history

### Profile

* User details
* Subscription
* Devices
* Logout
* Delete account

### Settings

* Theme
* Notifications
* Notification preferences
* Default proxy
* Privacy Policy
* Terms
* About

## Deliverables

```text
docs/phase-02-ui-ux/
├── DESIGN_SYSTEM.md
├── SCREEN_LIST.md
├── NAVIGATION.md
└── progress.md
```

Figma design may be created separately.

## Completion Criteria

* All screens designed
* Navigation finalized
* Design system finalized
* Responsive behavior documented
* Empty/loading/error states designed
* Notification UX designed
* Chat UX designed

---

# 12. Phase 03 — Project Setup

## Objective

Create the complete project structure.

## Repository

```text
proxym/
├── mobile/
├── backend/
├── admin/
├── docs/
├── PROJECT_PLAN.md
├── README.md
└── .gitignore
```

## Mobile

```text
Flutter
Dart
Riverpod
Dio
GoRouter
Secure Storage
Hive/SQLite
Firebase Cloud Messaging
```

## Backend

```text
PHP
Laravel
MySQL
Laravel Sanctum
```

## Admin

```text
Next.js
TypeScript
Tailwind CSS
```

## Hosting Verification

Before backend deployment, verify:

* PHP version
* Laravel compatibility
* Composer availability
* SSH access
* Cron jobs
* MySQL access
* Storage permissions
* Queue support
* `.env` support
* HTTPS
* Deployment method

## Important

Do not assume Hostinger Premium Web Hosting supports every Laravel feature.

Test the actual environment before production deployment.

If Laravel queues or background workers are not practical on shared hosting, the application must initially use synchronous processing or move heavy jobs to an external worker later.

## Completion Criteria

* Flutter project initialized
* Laravel project initialized
* Next.js project initialized
* Git configured
* Environment variables documented
* Local development works
* Hostinger compatibility documented

---

# 13. Phase 04 — Database Design

## Objective

Create a scalable MySQL database architecture.

## Initial Tables

```text
users
user_devices
proxies
proxy_groups
proxy_tests
proxy_usage
plans
subscriptions
payments
refresh_tokens
notifications
notification_preferences
device_tokens
support_conversations
support_participants
support_messages
support_attachments
admin_users
admin_roles
audit_logs
```

## Proxy Table

The proxy entity should support:

* ID
* User ID
* Group ID
* Name
* Host
* Port
* Protocol
* Username
* Encrypted password
* Status
* Last tested
* Latency
* IP
* Country
* ISP
* Created date
* Updated date

## Notification Data

The system should support:

* Notification ID
* User ID
* Notification type
* Title
* Message
* Data payload
* Read status
* Created date

## Chat Data

The system should support:

* Conversation ID
* User ID
* Admin/support agent ID
* Conversation status
* Message ID
* Sender ID
* Message content
* Attachment
* Read status
* Delivered status
* Timestamp

## Security

Proxy passwords must never be stored in plain text unless there is a documented technical reason.

Sensitive credentials must be encrypted securely.

Chat attachments must not expose private user data publicly.

## Deliverables

```text
docs/phase-04-database/
├── DATABASE_SCHEMA.md
├── ERD.md
├── MIGRATIONS.md
└── progress.md
```

## Completion Criteria

* Database schema finalized
* Relationships documented
* Migrations created
* Indexes reviewed
* Sensitive data protection documented
* Chat schema finalized
* Notification schema finalized

---

# 14. Phase 05 — Laravel Backend API

## Objective

Build the central ProxyM backend.

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
```

## User

```text
GET /api/users/me
PUT /api/users/me
DELETE /api/users/me
GET /api/users/me/devices
DELETE /api/users/me/devices/{id}
```

## Proxies

```text
GET /api/proxies
POST /api/proxies
GET /api/proxies/{id}
PUT /api/proxies/{id}
DELETE /api/proxies/{id}
```

## Proxy Groups

```text
GET /api/proxy-groups
POST /api/proxy-groups
PUT /api/proxy-groups/{id}
DELETE /api/proxy-groups/{id}
```

## Proxy Testing

```text
POST /api/proxies/{id}/test
POST /api/proxies/bulk-test
GET /api/proxy-tests/{id}
```

## Import / Export

```text
POST /api/proxies/import
GET /api/proxies/export
```

## Subscription

```text
GET /api/plans
GET /api/subscriptions
POST /api/subscriptions/verify
POST /api/subscriptions/restore
```

## Notifications

```text
GET /api/notifications
GET /api/notifications/{id}
POST /api/notifications/{id}/read
POST /api/notifications/read-all
GET /api/notification-preferences
PUT /api/notification-preferences
POST /api/devices/register
DELETE /api/devices/{id}
```

## Support Chat

```text
GET /api/support/conversations
POST /api/support/conversations
GET /api/support/conversations/{id}
POST /api/support/conversations/{id}/messages
POST /api/support/conversations/{id}/attachments
POST /api/support/conversations/{id}/close
POST /api/support/conversations/{id}/reopen
```

## Requirements

* REST API
* Authentication
* Authorization
* Request validation
* API resources
* Error handling
* Logging
* Rate limiting
* API versioning
* OpenAPI documentation

## Deliverables

```text
docs/phase-05-backend/
├── API_DOCUMENTATION.md
├── API_ARCHITECTURE.md
└── progress.md
```

---

# 15. Phase 06 — Proxy Engine

## Objective

Build reliable proxy parsing and testing.

## Features

* Parse proxy strings
* Validate formats
* Normalize proxy data
* HTTP testing
* HTTPS testing
* SOCKS4 testing
* SOCKS5 testing
* Username/password authentication
* Timeout detection
* Latency measurement
* IP detection
* Country detection
* ISP detection where available
* Dead proxy detection

## Proxy Status

```text
UNKNOWN
TESTING
WORKING
SLOW
TIMEOUT
DEAD
AUTH_FAILED
INVALID
```

## Testing Requirements

Each supported protocol must be tested with:

* Valid proxy
* Invalid proxy
* Wrong credentials
* Timeout
* Dead proxy
* Slow proxy
* Authentication failure

## Important Architecture Rule

Proxy testing must initially be designed for reasonable concurrency within Hostinger's limitations.

Do not create unrestricted parallel proxy requests.

If performance becomes a bottleneck, move proxy testing to a dedicated worker service.

---

# 16. Phase 07 — Flutter Android App

## Objective

Implement the ProxyM Android application.

## Features

* Splash
* Onboarding
* Authentication
* Login
* Register
* Home
* Proxy list
* Add proxy
* Edit proxy
* Delete proxy
* Search
* Filter
* Sort
* Proxy groups
* Single proxy testing
* Bulk testing
* Import
* Export
* Notifications
* Notification center
* Support chat
* Profile
* Settings
* Subscription

## Local Storage

The app should support local storage for basic proxy management.

Sensitive credentials must use secure storage.

The exact local/cloud synchronization strategy must be documented.

## UI Requirements

Every major screen must support:

* Loading state
* Empty state
* Error state
* Offline state
* Success state
* Authentication state

## Completion Criteria

* UI connected to API
* Authentication integrated
* Proxy CRUD integrated
* Proxy testing integrated
* Import/export integrated
* Local storage integrated
* Offline behavior implemented
* Notification system integrated
* Chat interface integrated
* Responsive UI completed

---

# 17. Phase 08 — Proxy Activation Strategy

## Objective

Determine how ProxyM will actually apply proxies to Android traffic.

## Important

A normal Android application cannot freely change the complete system-wide proxy configuration in every situation.

Before implementation, evaluate:

### Option A — Proxy Manager Only

ProxyM manages and tests proxies.

No system-wide traffic routing.

### Option B — Android Proxy Configuration

Use supported Android configuration mechanisms.

### Option C — Local VPN Tunnel

A local VPN service forwards traffic through the selected proxy.

### Option D — Proxy-enabled Browser/WebView

Proxy is used only inside a controlled browsing environment.

## Evaluation Criteria

* Android OS limitations
* HTTP/HTTPS support
* SOCKS4 support
* SOCKS5 support
* Authentication
* DNS behavior
* IPv6
* Battery usage
* Performance
* Google Play policies
* Privacy requirements

## Completion Criteria

A documented architecture must be approved before implementing any VPN-like functionality.

---

# 18. Phase 09 — Authentication & User Accounts

## Objective

Implement secure user accounts.

## Features

* Register
* Login
* Logout
* Token management
* Forgot password
* Reset password
* Email verification
* Device management
* Account deletion

## Security

* Secure password hashing
* Laravel Sanctum
* Token security
* Secure mobile token storage
* Rate limiting
* Brute-force protection
* Session management

---

# 19. Phase 10 — Free & Premium Plans

## Free Plan

Initial example:

* 5 saved proxies
* Limited proxy testing
* Basic import/export
* Basic proxy management
* Basic notifications
* Standard support

## Premium Plan

Initial example:

* Unlimited proxies
* Bulk testing
* Advanced testing
* Cloud sync
* Proxy groups
* Proxy rotation where supported
* No advertisements
* Priority support

Final limits must be decided during Phase 01.

## Payments

```text
Google Play Billing
        ↓
Google Play Purchase
        ↓
Backend Verification
        ↓
Subscription Status
        ↓
Premium Access
```

The backend must not trust only client-side purchase status.

## Completion Criteria

* Plans created
* Subscription flow implemented
* Purchase verification implemented
* Expiration handled
* Restore purchases implemented
* Premium access controlled server-side

---

# 20. Phase 11 — Admin Panel

## Objective

Build the ProxyM management dashboard.

## Dashboard

* Total users
* Active users
* Free users
* Premium users
* Proxy count
* Proxy tests
* Revenue
* New registrations
* Subscription conversion
* App statistics
* Notification statistics
* Support statistics

## Users

* List users
* Search users
* View user
* Block/unblock
* View subscription
* View devices
* View support conversations

## Proxy Management

* Proxy statistics
* Proxy health
* Proxy test statistics
* Remove invalid proxies
* Monitor testing

## Subscriptions

* Plans
* Active subscriptions
* Expired subscriptions
* Revenue
* Subscription history

## Notifications

* Create announcement
* Send push notification
* Send in-app notification
* Target Free users
* Target Premium users
* Target individual users
* Schedule notifications where supported
* View notification history

## Support Chat

* View all conversations
* Search conversations
* Search users
* Assign support agent
* Reply in real time
* Send attachments
* View conversation history
* Mark as open
* Mark as pending
* Mark as resolved
* Close conversation
* Reopen conversation

## System

* Maintenance mode
* Feature flags
* Notifications
* Announcements

## Security

* Admin authentication
* Role-based access
* 2FA
* Audit logs

---

# 21. Phase 12 — Security Hardening

## Backend

* HTTPS
* Secure authentication
* Rate limiting
* CORS
* Input validation
* SQL injection protection
* Secure headers
* Error handling
* Secure logging
* Secrets management
* Database security

## Mobile

* Secure token storage
* No API secrets in app
* No database credentials in app
* HTTPS-only API
* Secure local storage
* Sensitive data protection

## Admin

* 2FA
* Role-based access
* Audit logs
* Admin session security
* Strong password requirements
* Login rate limiting

## Proxy Credentials

* Encrypt credentials at rest
* Never expose passwords unnecessarily
* Never log proxy passwords
* Never include credentials in analytics
* Protect exported proxy files

## Chat Security

* User authorization
* Conversation access control
* Message validation
* Attachment validation
* File size limits
* Allowed file types
* Secure attachment storage
* Rate limiting
* Spam protection
* Abuse reporting
* Admin access controls

---

# 22. Phase 13 — Testing & QA

## Mobile Testing

Test:

* Android 10+
* Android 11
* Android 12
* Android 13
* Android 14
* Android 15+
* Different screen sizes
* Slow network
* Offline mode
* Authentication
* Proxy management
* Proxy testing
* Import/export
* Subscription
* Notifications
* Push notifications
* Chat
* Attachments
* Account deletion

## Proxy Engine Testing

Test:

* HTTP
* HTTPS
* SOCKS4
* SOCKS5
* Authenticated proxies
* Invalid proxies
* Dead proxies
* Slow proxies
* Timeouts
* Wrong credentials

## Backend Testing

* Unit tests
* Feature tests
* API tests
* Authentication tests
* Authorization tests
* Security tests
* Rate limit tests
* Database tests

## Notification Testing

* FCM token registration
* Push notification delivery
* Notification permissions
* Foreground notifications
* Background notifications
* Notification tap behavior
* Deep links
* Read/unread synchronization
* Invalid device tokens

## Chat Testing

* New conversation
* Send message
* Receive message
* Real-time delivery
* Offline behavior
* Reconnection
* Message ordering
* Read status
* Delivered status
* Attachments
* Large messages
* Closed conversations
* Reopened conversations

## Admin Testing

* Authentication
* Permissions
* User management
* Proxy management
* Subscription management
* Notification management
* Support chat
* Audit logs

## Performance Testing

Test:

* API response times
* Proxy test concurrency
* Database performance
* Large proxy imports
* Bulk testing
* Large proxy lists
* Chat concurrency
* Notification delivery

---

# 23. Phase 14 — Deployment

## Backend

Deploy Laravel backend to Hostinger only after confirming:

* PHP version
* Laravel compatibility
* Composer
* Database
* Storage permissions
* Cron support
* Queue requirements
* HTTPS
* Environment variables

## Initial Deployment

```text
Hostinger Premium Web Hosting
│
├── Laravel Backend
├── MySQL
├── Admin Panel / Static Admin
└── Website
```

External services:

```text
Firebase
└── Push Notifications

Real-Time Provider
└── Live Chat
```

## Future Deployment

If scaling requires:

```text
Hostinger
├── Website
└── Admin

VPS
├── Laravel API
├── Proxy Worker
└── Real-Time Infrastructure

MySQL
└── Hostinger or Dedicated Database
```

## Redis

Redis is **not required for MVP**.

Only introduce Redis when there is a real requirement for:

* High-performance caching
* Distributed rate limiting
* Background jobs
* Queue processing
* High traffic
* Real-time features

## Deployment Tasks

* Production environment
* HTTPS
* Domain
* Database
* Environment variables
* Backups
* Monitoring
* Logging
* Error tracking
* Cron jobs
* Database migration strategy
* FCM production configuration
* Real-time service configuration

---

# 24. Phase 15 — Google Play Store Release

## Prepare

* Google Play Console
* App name
* App icon
* Feature graphic
* Screenshots
* Short description
* Full description
* Privacy Policy
* Terms & Conditions
* Data Safety
* Content rating
* App category

## Build

```text
Flutter
    ↓
Release Build
    ↓
Android App Bundle
(.aab)
    ↓
Internal Testing
    ↓
Closed Testing
    ↓
Production
```

## Testing

* Internal testing
* Closed testing if required
* Production readiness review

## Completion Criteria

* Release AAB generated
* Internal testing completed
* Critical bugs fixed
* Play Store listing completed
* Privacy Policy published
* Terms published
* Data Safety completed accurately
* Required policy declarations completed
* Production release submitted

---

# 25. Phase 16 — Post-Launch

## Monitor

* Crash reports
* API errors
* Proxy test failures
* User registrations
* DAU
* MAU
* Retention
* Uninstalls
* Premium conversion
* Server performance
* Database performance
* Push notification delivery
* Chat availability
* Support response time

## Future Features

### v1.0

Core Proxy Manager

### v1.1

Performance improvements

### v1.2

Advanced proxy testing

### v1.5

Proxy groups and rotation

### v2.0

Cloud sync improvements

### v2.5

Advanced automation

### v3.0

VPN functionality, if technically and legally appropriate

---

# 26. Phase 17 — Real-Time Notifications & Chat Support

## Objective

Implement reliable notifications and real-time customer support.

This phase covers:

1. Push notifications
2. In-app notifications
3. Notification preferences
4. Notification history
5. Real-time customer support
6. Real-time messaging
7. Chat history
8. Admin support dashboard

---

## 26.1 Push Notifications

Use:

```text
Firebase Cloud Messaging (FCM)
```

Architecture:

```text
Laravel Backend
      │
      │ Notification Event
      ▼
Firebase Cloud Messaging
      │
      ▼
ProxyM Flutter App
      │
      ▼
Android Push Notification
```

## Notification Types

Users may receive:

* Proxy test completed
* Bulk proxy testing completed
* Proxy status changed
* Subscription activated
* Subscription expiring
* Subscription expired
* Payment successful
* Payment failed
* New app announcement
* Maintenance notification
* Security alert
* Admin announcement
* New support message

---

## 26.2 In-App Notifications

The app should provide:

* Notification center
* Notification list
* Read/unread status
* Mark as read
* Mark all as read
* Notification details
* Notification preferences
* Notification history

---

## 26.3 Notification Preferences

Users should be able to control:

* Marketing notifications
* Product announcements
* Proxy notifications
* Subscription notifications
* Security notifications
* Support notifications

Security-critical notifications may not be disableable.

---

## 26.4 Device Token Management

The backend must maintain:

```text
User
   │
   ├── Android Device 1
   │       └── FCM Token
   │
   ├── Android Device 2
   │       └── FCM Token
   │
   └── Android Device 3
           └── FCM Token
```

The system must:

* Register FCM tokens
* Update tokens
* Remove invalid tokens
* Support multiple devices
* Prevent duplicate tokens

---

## 26.5 Real-Time Support Chat

Users should be able to:

* Start support conversation
* Send messages
* Receive messages in real time
* View message timestamps
* View message status
* View read status
* View delivered status
* Send attachments
* View chat history
* Close conversation
* Reopen conversation

---

## 26.6 Admin Support Chat

Admins/support agents should be able to:

* View all conversations
* Search users
* Search conversations
* Assign support agents
* Reply in real time
* Send attachments
* View conversation history
* Mark conversation as open
* Mark as pending
* Mark as resolved
* Close conversation
* Reopen conversation

---

## 26.7 Chat Architecture

The recommended architecture is:

```text
Flutter App
    │
    ├──────── REST API ────────► Laravel
    │                              │
    │                              ▼
    │                            MySQL
    │
    └──── Real-Time Connection ──► Real-Time Service
                                      │
                                      ▼
                                 Live Messages
```

Laravel remains responsible for:

* Authentication
* Authorization
* User identity
* Conversation management
* Message persistence
* Message history
* Admin permissions

The real-time service is responsible for:

* Live message delivery
* Presence
* Real-time events
* Reconnection

The exact provider must be selected after evaluating cost, security, Flutter compatibility, Laravel compatibility, and Hostinger limitations.

---

## 26.8 Offline Chat Behavior

The app must handle:

* Offline messages
* Failed messages
* Retry
* Reconnection
* Message synchronization
* Duplicate prevention
* Message ordering

When a user reconnects:

```text
Offline
   ↓
Internet Restored
   ↓
Reconnect
   ↓
Sync Messages
   ↓
Update Read Status
```

---

## 26.9 Chat Attachments

If attachments are supported:

Allowed initial formats may include:

* JPG
* JPEG
* PNG
* PDF

The system must enforce:

* File size limits
* MIME validation
* File extension validation
* Secure storage
* Access control
* Virus/malware scanning where practical

---

## 26.10 Completion Criteria

Phase 17 is complete only when:

* FCM integrated
* Device tokens managed
* Push notifications working
* In-app notifications working
* Notification preferences working
* Notification history working
* Real-time chat working
* Message persistence working
* Chat history working
* Read/unread status working
* Delivered status working
* Offline handling working
* Reconnection working
* Admin chat working
* Attachment security tested
* Notification tests pass
* Chat tests pass
* `progress.md` updated

---

# 27. Recommended Repository Structure

```text
proxym/
│
├── mobile/
│   ├── lib/
│   ├── assets/
│   ├── test/
│   ├── integration_test/
│   └── pubspec.yaml
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   ├── storage/
│   ├── composer.json
│   └── README.md
│
├── admin/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── docs/
│   │
│   ├── phase-01-requirements/
│   │   ├── PRD.md
│   │   ├── FEATURE_LIST.md
│   │   ├── USER_FLOWS.md
│   │   └── progress.md
│   │
│   ├── phase-02-ui-ux/
│   │   ├── DESIGN_SYSTEM.md
│   │   ├── SCREEN_LIST.md
│   │   ├── NAVIGATION.md
│   │   └── progress.md
│   │
│   ├── phase-03-project-setup/
│   │   ├── DEVELOPMENT_SETUP.md
│   │   ├── ARCHITECTURE.md
│   │   └── progress.md
│   │
│   ├── phase-04-database/
│   │   ├── DATABASE_SCHEMA.md
│   │   ├── ERD.md
│   │   ├── MIGRATIONS.md
│   │   └── progress.md
│   │
│   ├── phase-05-backend/
│   │   ├── API_DOCUMENTATION.md
│   │   ├── API_ARCHITECTURE.md
│   │   └── progress.md
│   │
│   ├── phase-06-proxy-engine/
│   │   └── progress.md
│   │
│   ├── phase-07-mobile-app/
│   │   └── progress.md
│   │
│   ├── phase-08-proxy-activation/
│   │   └── progress.md
│   │
│   ├── phase-09-authentication/
│   │   └── progress.md
│   │
│   ├── phase-10-subscriptions/
│   │   └── progress.md
│   │
│   ├── phase-11-admin-panel/
│   │   └── progress.md
│   │
│   ├── phase-12-security/
│   │   └── progress.md
│   │
│   ├── phase-13-testing/
│   │   └── progress.md
│   │
│   ├── phase-14-deployment/
│   │   └── progress.md
│   │
│   ├── phase-15-play-store/
│   │   └── progress.md
│   │
│   ├── phase-16-post-launch/
│   │   └── progress.md
│   │
│   └── phase-17-realtime/
│       └── progress.md
│
├── PROJECT_PLAN.md
├── README.md
└── .gitignore
```

---

# 28. AI Agent Phase Execution Protocol

Every AI agent must follow this exact workflow.

## Step 1 — Read

Read:

```text
PROJECT_PLAN.md
```

## Step 2 — Identify

Determine the assigned phase.

## Step 3 — Read Progress

Open:

```text
docs/phase-XX-name/progress.md
```

If it does not exist, create it before implementation.

## Step 4 — Inspect

Review:

* Existing code
* Existing architecture
* Existing dependencies
* Existing database
* Existing APIs
* Existing tests
* Existing documentation

## Step 5 — Plan

Before implementation:

* Understand requirements
* Identify affected files
* Identify dependencies
* Identify risks

## Step 6 — Implement

Implement only the assigned phase.

Do not start future phases.

## Step 7 — Test

Run all relevant tests.

## Step 8 — Document

Update:

```text
progress.md
```

Include:

* Completed tasks
* Files created
* Files modified
* Tests performed
* Test results
* Issues
* Decisions
* Remaining work

## Step 9 — Final Verification

Do not mark `COMPLETED` unless:

```text
[ ] Implementation complete
[ ] Tests pass
[ ] No critical errors
[ ] Documentation complete
[ ] progress.md updated
```

## Step 10 — Stop

After the assigned phase is complete, stop.

Do not automatically begin the next phase.

---

# 29. MVP Priority

The recommended implementation order is:

```text
Phase 01 — Requirements
        ↓
Phase 02 — UI/UX
        ↓
Phase 03 — Project Setup
        ↓
Phase 04 — Database
        ↓
Phase 05 — Laravel Backend API
        ↓
Phase 06 — Proxy Engine
        ↓
Phase 07 — Flutter Mobile App
        ↓
Phase 08 — Proxy Activation Decision
        ↓
Phase 09 — Authentication
        ↓
Phase 10 — Subscriptions
        ↓
Phase 11 — Admin Panel
        ↓
Phase 12 — Security
        ↓
Phase 13 — Testing
        ↓
Phase 14 — Deployment
        ↓
Phase 15 — Google Play Store
        ↓
Phase 16 — Post Launch
        ↓
Phase 17 — Real-Time Notifications & Chat
```

### Recommended Development Adjustment

Although Phase 17 is listed separately for organizational purposes, the **notification and chat database/API requirements must be considered during Phases 04 and 05**, and the UI must be considered during Phase 02.

Phase 17 is the final integration and production-hardening phase for these features.

---

# 30. Current Project Status

```text
Phase 01 — Requirements              NOT_STARTED
Phase 02 — UI/UX                     NOT_STARTED
Phase 03 — Project Setup             NOT_STARTED
Phase 04 — Database                  NOT_STARTED
Phase 05 — Backend API               NOT_STARTED
Phase 06 — Proxy Engine              NOT_STARTED
Phase 07 — Mobile App                NOT_STARTED
Phase 08 — Proxy Activation          NOT_STARTED
Phase 09 — Authentication            NOT_STARTED
Phase 10 — Subscriptions             NOT_STARTED
Phase 11 — Admin Panel               NOT_STARTED
Phase 12 — Security                  NOT_STARTED
Phase 13 — Testing                   NOT_STARTED
Phase 14 — Deployment                NOT_STARTED
Phase 15 — Play Store                NOT_STARTED
Phase 16 — Post Launch               NOT_STARTED
Phase 17 — Real-Time Notifications   NOT_STARTED
```

---

# 31. Definition of Done

ProxyM is considered ready for initial production release only when:

```text
[ ] Android application builds successfully
[ ] Core proxy management works
[ ] Supported proxy formats work
[ ] HTTP proxy testing works
[ ] HTTPS proxy testing works
[ ] SOCKS4 proxy testing works
[ ] SOCKS5 proxy testing works
[ ] Proxy authentication works
[ ] Authentication works
[ ] Backend is deployed securely
[ ] Database backups are configured
[ ] Admin panel is functional
[ ] Notifications work reliably
[ ] Push notifications work reliably
[ ] Real-time support chat works
[ ] Chat history works
[ ] Offline chat behavior works
[ ] Critical security issues are resolved
[ ] Automated tests pass
[ ] Manual QA is complete
[ ] Privacy Policy is published
[ ] Terms & Conditions are published
[ ] Google Play Data Safety is accurate
[ ] Google Play Store listing is complete
[ ] Release AAB is generated
[ ] Internal testing is complete
[ ] Required closed testing is complete
[ ] Production release is submitted
```

---

# 32. Final Instructions to AI Agents

IMPORTANT:

Do not assume a phase is complete because code was written.

A phase is complete only after:

1. Implementation
2. Testing
3. Documentation
4. Verification
5. `progress.md` update

Every AI agent must create or update the phase-specific:

```text
progress.md
```

before finishing its assigned work.

Never delete or reset existing progress history.

If blocked:

```text
Status: BLOCKED
```

The AI agent must document:

* Why it is blocked
* What was attempted
* What information is required
* Recommended next action

Then stop.

Do not make unsafe assumptions.

---

# 33. Master Project Rule

The ProxyM project follows this principle:

```text
DOCUMENT
    ↓
DESIGN
    ↓
IMPLEMENT
    ↓
TEST
    ↓
DOCUMENT PROGRESS
    ↓
VERIFY
    ↓
COMPLETE
    ↓
STOP
```

No phase should be skipped.

No future phase should be started automatically.

Every phase must leave behind a clear `progress.md` record so the next AI agent can continue exactly where the previous agent stopped.

The project must prioritize:

1. Security
2. Reliability
3. Maintainability
4. User experience
5. Performance
6. Scalability
7. Cost efficiency

The initial goal is to build a stable ProxyM MVP using the existing Hostinger Premium Web Hosting infrastructure and avoid unnecessary VPS, Redis, Docker, or external infrastructure costs until the actual application requirements justify them.

The backend architecture should remain modular enough that heavy proxy testing, real-time messaging, or other resource-intensive workloads can be migrated to dedicated infrastructure without requiring a complete rewrite of the application.
