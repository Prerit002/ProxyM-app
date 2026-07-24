<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\ProxyEngine;

class ProxyEngineTest extends TestCase
{
    public function test_can_parse_standard_proxy()
    {
        $result = ProxyEngine::parse('192.168.1.1:8080');
        
        $this->assertEquals('192.168.1.1', $result['host']);
        $this->assertEquals('8080', $result['port']);
        $this->assertNull($result['username']);
        $this->assertNull($result['password']);
    }

    public function test_can_parse_authenticated_proxy()
    {
        $result = ProxyEngine::parse('10.0.0.1:3128:user1:pass123');
        
        $this->assertEquals('10.0.0.1', $result['host']);
        $this->assertEquals('3128', $result['port']);
        $this->assertEquals('user1', $result['username']);
        $this->assertEquals('pass123', $result['password']);
    }
}
