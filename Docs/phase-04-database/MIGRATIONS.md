# ProxyM Migrations

The migrations will be generated during Phase 05 using standard Laravel conventions:

```bash
php artisan make:model ProxyGroup -m
php artisan make:model Proxy -m
php artisan make:model Plan -m
php artisan make:model Subscription -m
php artisan make:model Notification -m
php artisan make:model SupportConversation -m
php artisan make:model SupportMessage -m
```

*Ponytail note: Let Laravel's schema builder handle foreign keys and indexes. No need to pre-write the raw SQL files here. Proxy passwords will be encrypted at the Eloquent model level using `Crypt::encryptString()`.*
