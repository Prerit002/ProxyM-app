# ProxyM — Development Phases

This document is the high-level phase tracker for the ProxyM project.

The detailed requirements, implementation instructions, and technical documentation are maintained in `PROJECT_PLAN.md`.

Each phase must have its own `progress.md` file.

---

# Phase Overview

| Phase | Name                                 | Status      | Progress File                                |
| ----- | ------------------------------------ | ----------- | -------------------------------------------- |
| 01    | Requirements & Product Specification | COMPLETED   | `docs/phase-01-requirements/progress.md`     |
| 02    | UI/UX Design                         | COMPLETED   | `docs/phase-02-ui-ux/progress.md`            |
| 03    | Project Setup                        | COMPLETED   | `docs/phase-03-project-setup/progress.md`    |
| 04    | Database Design                      | COMPLETED   | `docs/phase-04-database/progress.md`         |
| 05    | Laravel Backend API                  | COMPLETED   | `docs/phase-05-backend/progress.md`          |
| 06    | Proxy Engine                         | COMPLETED   | `docs/phase-06-proxy-engine/progress.md`     |
| 07    | Flutter Android App                  | COMPLETED   | `docs/phase-07-mobile-app/progress.md`       |
| 08    | Testing System                       | COMPLETED   | `docs/phase-08-testing/progress.md`          |
| 09    | Backend Integration                  | COMPLETED   | `docs/phase-09-integration/progress.md`      |
| 10    | Review & Polish                      | COMPLETED   | `docs/phase-10-review/progress.md`           |
| 11    | Admin Panel                          | NOT_STARTED | `docs/phase-11-admin-panel/progress.md`      |
| 12    | Security Hardening                   | NOT_STARTED | `docs/phase-12-security/progress.md`         |
| 13    | Testing & QA                         | NOT_STARTED | `docs/phase-13-testing/progress.md`          |
| 14    | Production Deployment                | NOT_STARTED | `docs/phase-14-deployment/progress.md`       |
| 15    | Google Play Store Release            | NOT_STARTED | `docs/phase-15-play-store/progress.md`       |
| 16    | Post-Launch Monitoring               | NOT_STARTED | `docs/phase-16-post-launch/progress.md`      |
| 17    | Real-Time Notifications & Chat       | NOT_STARTED | `docs/phase-17-realtime/progress.md`         |

---

# Phase 01 — Requirements & Product Specification

**Status:** `NOT_STARTED`

## Objective

Finalize exactly what ProxyM will do before development begins.

## Main Tasks

* Define product scope
* Define target users
* Define Free plan
* Define Premium plan
* Define supported proxy protocols
* Define supported proxy formats
* Define proxy storage strategy
* Define local/cloud synchronization
* Define proxy testing
* Define import/export
* Define proxy activation strategy
* Define authentication
* Define subscriptions
* Define notifications
* Define real-time support chat
* Define admin requirements
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

## Completion Requirement

Phase 01 is complete only when the product scope and technical requirements are documented and verified.

---

# Phase 02 — UI/UX Design

**Status:** `NOT_STARTED`

## Objective

Design the complete ProxyM mobile experience.

## Main Screens

* Splash
* Onboarding
* Login
* Register
* Forgot password
* Home
* Proxy list
* Add proxy
* Edit proxy
* Proxy testing
* Import/export
* Proxy groups
* Notifications
* Notification center
* Support chat
* Chat history
* Premium
* Subscription
* Profile
* Settings

## Main Tasks

* Design navigation
* Design design system
* Design components
* Design loading states
* Design empty states
* Design error states
* Design offline states
* Design notification experience
* Design support chat experience

## Deliverables

```text
docs/phase-02-ui-ux/
├── DESIGN_SYSTEM.md
├── SCREEN_LIST.md
├── NAVIGATION.md
└── progress.md
```

---

# Phase 03 — Project Setup

**Status:** `NOT_STARTED`

## Objective

Initialize the complete development architecture.

## Mobile

* Flutter
* Dart
* Riverpod
* Dio
* GoRouter
* Secure Storage
* Hive/SQLite
* Firebase Cloud Messaging

## Backend

* PHP
* Laravel
* MySQL
* Laravel Sanctum

## Admin

* Next.js
* TypeScript
* Tailwind CSS

## Main Tasks

* Create repository
* Create Flutter project
* Create Laravel project
* Create Next.js project
* Configure Git
* Configure environment variables
* Configure local development
* Verify Hostinger compatibility
* Document deployment requirements

---

# Phase 04 — Database Design

**Status:** `NOT_STARTED`

## Objective

Design the complete MySQL database.

## Main Tables

* users
* user_devices
* proxies
* proxy_groups
* proxy_tests
* proxy_usage
* plans
* subscriptions
* payments
* refresh_tokens
* notifications
* notification_preferences
* device_tokens
* support_conversations
* support_participants
* support_messages
* support_attachments
* admin_users
* admin_roles
* audit_logs

## Main Tasks

* Create schema
* Create relationships
* Create indexes
* Create migrations
* Design proxy credential encryption
* Design notification storage
* Design chat storage
* Design attachment storage

## Deliverables

```text
docs/phase-04-database/
├── DATABASE_SCHEMA.md
├── ERD.md
├── MIGRATIONS.md
└── progress.md
```

---

# Phase 05 — Laravel Backend API

**Status:** `NOT_STARTED`

## Objective

Build the core backend API.

## Main Modules

* Authentication
* User management
* Proxy management
* Proxy groups
* Proxy testing
* Import/export
* Notifications
* Subscriptions
* Support chat
* Device management

## Main Tasks

* Build REST API
* Build authentication
* Build authorization
* Build validation
* Build API resources
* Build error handling
* Build logging
* Build rate limiting
* Create API documentation

## Deliverables

```text
docs/phase-05-backend/
├── API_DOCUMENTATION.md
├── API_ARCHITECTURE.md
└── progress.md
```

---

# Phase 06 — Proxy Engine

**Status:** `NOT_STARTED`

## Objective

Build the proxy parsing and testing system.

## Supported Protocols

* HTTP
* HTTPS
* SOCKS4
* SOCKS5

## Main Tasks

* Proxy parser
* Format validation
* Proxy normalization
* Authentication
* Timeout detection
* Latency measurement
* IP detection
* Country detection
* ISP detection
* Dead proxy detection
* Bulk testing

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

## Important

Concurrency must be controlled.

Heavy proxy testing should be moved to dedicated infrastructure if Hostinger shared hosting becomes a limitation.

---

# Phase 07 — Flutter Android App

**Status:** `NOT_STARTED`

## Objective

Build the ProxyM Android application.

## Main Tasks

* Authentication UI
* Home screen
* Proxy management
* Proxy groups
* Proxy testing
* Bulk testing
* Import/export
* Local storage
* Cloud synchronization
* Notifications
* Notification center
* Support chat
* Profile
* Settings
* Subscription UI

## Requirements

Every major feature must support:

* Loading states
* Empty states
* Error states
* Offline states
* Success states

---

# Phase 08 — Proxy Activation Strategy

**Status:** `NOT_STARTED`

## Objective

Decide how ProxyM will apply proxies to Android traffic.

## Options

### Option A

Proxy management and testing only.

### Option B

Supported Android proxy configuration.

### Option C

Local VPN tunnel forwarding traffic through a proxy.

### Option D

Proxy-enabled browser/WebView.

## Evaluation

* Android limitations
* HTTP/HTTPS
* SOCKS4
* SOCKS5
* Authentication
* DNS
* IPv6
* Battery usage
* Performance
* Google Play policies
* Privacy

## Completion Requirement

No VPN-like implementation should begin until the architecture is documented and approved.

---

# Phase 09 — Authentication & User Accounts

**Status:** `NOT_STARTED`

## Main Tasks

* Registration
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
* Secure token storage
* Rate limiting
* Brute-force protection
* Session management

---

# Phase 10 — Free & Premium Subscriptions

**Status:** `NOT_STARTED`

## Free Plan

Initial example:

* Limited proxies
* Limited proxy testing
* Basic import/export
* Basic management
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

## Payment

Use:

```text
Google Play Billing
        ↓
Purchase
        ↓
Backend Verification
        ↓
Subscription Status
        ↓
Premium Access
```

## Main Tasks

* Plans
* Subscriptions
* Purchase verification
* Expiration handling
* Restore purchases
* Server-side entitlement verification

---

# Phase 11 — Admin Panel

**Status:** `NOT_STARTED`

## Objective

Build the ProxyM administration dashboard.

## Main Modules

### Dashboard

* Users
* Active users
* Premium users
* Proxy statistics
* Proxy tests
* Revenue
* Subscription conversion
* Notifications
* Support statistics

### Users

* User list
* Search
* User details
* Block/unblock
* Subscription
* Devices

### Proxy Management

* Proxy statistics
* Proxy health
* Testing statistics
* Invalid proxy management

### Subscriptions

* Plans
* Active subscriptions
* Expired subscriptions
* Revenue

### Notifications

* Create notification
* Push notification
* In-app notification
* User targeting
* Notification history

### Support

* Conversations
* Search
* Assign agents
* Real-time replies
* Attachments
* Conversation status

### System

* Maintenance mode
* Feature flags
* Announcements

---

# Phase 12 — Security Hardening

**Status:** `NOT_STARTED`

## Backend

* HTTPS
* Authentication security
* Authorization
* Rate limiting
* CORS
* Input validation
* SQL injection protection
* Secure headers
* Error handling
* Secret management

## Mobile

* Secure token storage
* HTTPS-only API
* No API secrets
* No database credentials
* Secure local storage

## Admin

* 2FA
* RBAC
* Audit logs
* Secure sessions
* Login protection

## Proxy Credentials

* Encryption at rest
* No password logging
* Secure exports

## Chat

* Authorization
* Message validation
* Attachment validation
* File limits
* Secure storage
* Spam protection
* Rate limiting

---

# Phase 13 — Testing & QA

**Status:** `NOT_STARTED`

## Mobile

Test:

* Android 10+
* Different screen sizes
* Slow network
* Offline mode
* Authentication
* Proxy management
* Proxy testing
* Import/export
* Notifications
* Push notifications
* Subscriptions
* Chat
* Attachments
* Account deletion

## Backend

* Unit tests
* Feature tests
* API tests
* Authentication tests
* Authorization tests
* Security tests
* Rate-limit tests
* Database tests

## Proxy Engine

Test:

* HTTP
* HTTPS
* SOCKS4
* SOCKS5
* Authentication
* Invalid proxies
* Dead proxies
* Slow proxies
* Timeouts

## Notifications

Test:

* FCM registration
* Push delivery
* Foreground notifications
* Background notifications
* Notification tap
* Deep links
* Read/unread
* Invalid tokens

## Chat

Test:

* Create conversation
* Send message
* Receive message
* Real-time delivery
* Offline behavior
* Reconnection
* Message ordering
* Read status
* Delivered status
* Attachments
* Closed conversations
* Reopened conversations

---

# Phase 14 — Production Deployment

**Status:** `NOT_STARTED`

## Initial Architecture

```text
Hostinger Premium Web Hosting
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

## Main Tasks

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
* FCM production setup
* Real-time service setup

## Future Scaling

If required:

```text
Hostinger
├── Website
└── Admin

VPS
├── Laravel API
├── Proxy Workers
└── Real-Time Infrastructure

Database
└── Dedicated / Managed MySQL
```

Redis is not required for MVP.

---

# Phase 15 — Google Play Store Release

**Status:** `NOT_STARTED`

## Main Tasks

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

## Release Process

```text
Flutter
    ↓
Release Build
    ↓
Android App Bundle (.aab)
    ↓
Internal Testing
    ↓
Closed Testing
    ↓
Production
```

## Completion

* AAB generated
* Testing completed
* Critical bugs fixed
* Listing complete
* Policies complete
* Production submitted

---

# Phase 16 — Post-Launch Monitoring

**Status:** `NOT_STARTED`

## Monitor

* Crash reports
* API errors
* Proxy failures
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

## Future Versions

```text
v1.0
Core Proxy Manager

v1.1
Performance Improvements

v1.2
Advanced Proxy Testing

v1.5
Proxy Groups and Rotation

v2.0
Cloud Sync Improvements

v2.5
Advanced Automation

v3.0
Optional VPN Functionality
```

---

# Phase 17 — Real-Time Notifications & Chat Support

**Status:** `NOT_STARTED`

## Objective

Implement production-ready notifications and real-time customer support.

---

## Notifications

Use:

```text
Firebase Cloud Messaging (FCM)
```

## Notification Types

* Proxy test completed
* Bulk test completed
* Proxy status changed
* Subscription activated
* Subscription expiring
* Subscription expired
* Payment successful
* Payment failed
* Announcements
* Maintenance
* Security alerts
* Admin notifications
* New support messages

---

## In-App Notifications

Implement:

* Notification center
* Notification list
* Read/unread
* Mark as read
* Mark all as read
* Notification details
* Notification preferences
* Notification history

---

## Device Tokens

Support:

* Register FCM token
* Update token
* Remove invalid token
* Multiple devices
* Duplicate token prevention

---

## Real-Time Support Chat

Users can:

* Start conversation
* Send messages
* Receive messages instantly
* View timestamps
* View delivered status
* View read status
* Send attachments
* View history
* Close conversation
* Reopen conversation

Admins can:

* View conversations
* Search users
* Search chats
* Assign support agents
* Reply instantly
* Send attachments
* View history
* Change status
* Close conversations
* Reopen conversations

---

## Recommended Architecture

```text
Flutter App
    │
    ├──── REST API ────► Laravel
    │                       │
    │                       ▼
    │                     MySQL
    │
    └── Real-Time ──────► Real-Time Service
                              │
                              ▼
                         Live Messages
```

Laravel handles:

* Authentication
* Authorization
* Users
* Conversations
* Message persistence
* Message history
* Permissions

The real-time service handles:

* Live message delivery
* Presence
* Real-time events
* Reconnection

---

## Offline Chat

The application must support:

* Offline state
* Failed messages
* Retry
* Reconnection
* Message synchronization
* Duplicate prevention
* Correct message ordering

---

# Development Order

The recommended implementation order is:

```text
01 Requirements
      ↓
02 UI/UX
      ↓
03 Project Setup
      ↓
04 Database
      ↓
05 Backend API
      ↓
06 Proxy Engine
      ↓
07 Flutter App
      ↓
08 Proxy Activation
      ↓
09 Authentication
      ↓
10 Subscriptions
      ↓
11 Admin Panel
      ↓
12 Security
      ↓
13 Testing
      ↓
14 Deployment
      ↓
15 Play Store
      ↓
16 Post Launch
      ↓
17 Real-Time Notifications & Chat
```

---

# AI Agent Execution Rules

Every AI agent must follow:

```text
1. Read PROJECT_PLAN.md
        ↓
2. Read PHASES.md
        ↓
3. Identify assigned phase
        ↓
4. Read phase progress.md
        ↓
5. Inspect existing code
        ↓
6. Implement ONLY assigned phase
        ↓
7. Run tests
        ↓
8. Update progress.md
        ↓
9. Verify completion
        ↓
10. STOP
```

An AI agent must never automatically start the next phase.

---

# Phase Completion Rule

A phase can only be marked:

```text
COMPLETED
```

when all applicable requirements are satisfied:

```text
[ ] Implementation complete
[ ] Tests performed
[ ] Tests pass
[ ] No critical errors
[ ] Documentation complete
[ ] progress.md updated
[ ] Final verification complete
```

If blocked:

```text
Status: BLOCKED
```

The agent must document:

* Reason for blockage
* What was attempted
* What is missing
* Recommended next action

Then stop.

---

# Master Project Status

```text
Phase 01 — NOT_STARTED
Phase 02 — NOT_STARTED
Phase 03 — NOT_STARTED
Phase 04 — NOT_STARTED
Phase 05 — NOT_STARTED
Phase 06 — NOT_STARTED
Phase 07 — NOT_STARTED
Phase 08 — NOT_STARTED
Phase 09 — NOT_STARTED
Phase 10 — NOT_STARTED
Phase 11 — NOT_STARTED
Phase 12 — NOT_STARTED
Phase 13 — NOT_STARTED
Phase 14 — NOT_STARTED
Phase 15 — NOT_STARTED
Phase 16 — NOT_STARTED
Phase 17 — NOT_STARTED
```

---

# Project Completion

ProxyM is production-ready only when:

```text
[ ] Core proxy management works
[ ] Proxy testing works
[ ] HTTP/HTTPS works
[ ] SOCKS4/SOCKS5 works
[ ] Authentication works
[ ] Backend deployed securely
[ ] MySQL backups configured
[ ] Admin panel functional
[ ] Push notifications work
[ ] In-app notifications work
[ ] Real-time support chat works
[ ] Chat history works
[ ] Offline chat works
[ ] Critical security issues resolved
[ ] Automated tests pass
[ ] Manual QA complete
[ ] Privacy Policy published
[ ] Terms published
[ ] Google Play Data Safety completed
[ ] Play Store listing complete
[ ] AAB generated
[ ] Internal testing complete
[ ] Required closed testing complete
[ ] Production release approved
```

---

# Final Rule

The ProxyM development process is:

```text
READ
  ↓
UNDERSTAND
  ↓
IMPLEMENT
  ↓
TEST
  ↓
DOCUMENT
  ↓
VERIFY
  ↓
UPDATE progress.md
  ↓
STOP
```

Every AI agent must work only on the assigned phase.

Every phase must maintain its own `progress.md`.

No phase should be marked `COMPLETED` without verification.

No progress history should be deleted or reset.

If blocked, document the blocker and stop.

The goal is to ensure that any future AI agent can open:

```text
PROJECT_PLAN.md
PHASES.md
docs/phase-XX-name/progress.md
```

and immediately understand the project's current state, completed work, remaining work, and exact next steps.
