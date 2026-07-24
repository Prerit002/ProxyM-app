# ProxyM API Documentation

## Auth
- `POST /api/login`
- `POST /api/register`
- `POST /api/logout` (Requires Token)

## Proxies
- `GET /api/proxies`
- `POST /api/proxies`
- `GET /api/proxies/{id}`
- `PUT /api/proxies/{id}`
- `DELETE /api/proxies/{id}`

## Testing
- `POST /api/proxies/{id}/test`

## Subscriptions
- `GET /api/plans`
- `GET /api/subscriptions`

## Communication
- `GET /api/notifications`
- `GET /api/support/conversations`

*Ponytail note: Standard Laravel Resource routes. Endpoints automatically correspond to the generated Controller methods.*
