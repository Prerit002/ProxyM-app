<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'token_type']);
                 
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'token_type']);
    }

    public function test_login_rate_limiting()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password123')
        ]);

        // Hit the endpoint 6 times with bad password
        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/login', [
                'email' => $user->email,
                'password' => 'wrongpass'
            ])->assertStatus(401);
        }

        // 7th attempt should be blocked by throttle:6,1
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpass'
        ]);

        $response->assertStatus(429); // Too Many Requests
    }
}
