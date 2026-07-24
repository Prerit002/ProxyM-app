# ProxyM API Architecture

**Framework:** Laravel
**Auth:** Sanctum (Token-based)
**Pattern:** MVC (API Resource Controllers)
**Data Layer:** Eloquent ORM
**Security:** Rate limited (60/min), HTTPS strictly (on prod), Passwords encrypted at rest (Laravel Crypt).

*Ponytail note: Rely completely on standard Laravel API scaffolding. Custom middleware or repositories aren't necessary for an MVP of this scale.*
