<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiRouteTest extends TestCase
{
    public function test_api_requires_authentication_for_proxies()
    {
        // Assert that a standard GET request to /api/user returns a 401 Unauthorized
        // because we haven't passed a Sanctum token.
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }
}
