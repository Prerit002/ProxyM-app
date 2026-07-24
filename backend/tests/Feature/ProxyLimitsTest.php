<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Proxy;
use App\Models\Plan;

class ProxyLimitsTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_user_can_add_up_to_limit()
    {
        $user = User::factory()->create(); // No plan_id, defaults to 5

        // Add 5 proxies
        for ($i = 0; $i < 5; $i++) {
            Proxy::create([
                'user_id' => $user->id,
                'ip_address' => "192.168.1.$i",
                'port' => '8080',
                'protocol' => 'HTTP',
                'status' => 'UNKNOWN'
            ]);
        }

        // Attempting to add 6th should fail
        $response = $this->actingAs($user)->postJson('/api/proxies', [
            'raw_proxy' => '192.168.1.99:8080',
            'protocol' => 'HTTP'
        ]);

        $response->assertStatus(403)
                 ->assertJsonFragment(['error' => 'Proxy limit reached']);
    }

    public function test_premium_user_can_exceed_free_limit()
    {
        $plan = Plan::create([
            'name' => 'Premium',
            'description' => 'Test plan',
            'price' => 9.99,
            'max_proxies' => 50
        ]);

        $user = User::factory()->create(['plan_id' => $plan->id]);

        // Add 5 proxies
        for ($i = 0; $i < 5; $i++) {
            Proxy::create([
                'user_id' => $user->id,
                'ip_address' => "192.168.1.$i",
                'port' => '8080',
                'protocol' => 'HTTP',
                'status' => 'UNKNOWN'
            ]);
        }

        // Attempting to add 6th should succeed
        $response = $this->actingAs($user)->postJson('/api/proxies', [
            'raw_proxy' => '192.168.1.99:8080',
            'protocol' => 'HTTP'
        ]);

        $response->assertStatus(201);
    }
}
