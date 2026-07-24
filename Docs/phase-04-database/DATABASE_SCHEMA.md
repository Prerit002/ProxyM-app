# ProxyM Database Schema

*Minimalist structure to support core MVP requirements.*

- **users**: id, name, email, password, role (user/admin), created_at, updated_at
- **proxy_groups**: id, user_id, name, created_at, updated_at
- **proxies**: id, user_id, group_id, host, port, protocol, username, password (encrypted), status, latency, created_at, updated_at
- **plans**: id, name, price, max_proxies, is_active
- **subscriptions**: id, user_id, plan_id, expires_at, status
- **notifications**: id, user_id, title, message, is_read, created_at
- **support_conversations**: id, user_id, status (open/resolved), created_at, updated_at
- **support_messages**: id, conversation_id, sender_id (user/admin), content, attachment_path, created_at

*Ponytail note: Excluded fluff like `user_devices` or `audit_logs` for MVP unless strictly mandated by compliance later.*
