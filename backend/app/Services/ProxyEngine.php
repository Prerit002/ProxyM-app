<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ProxyEngine
{
    public static function parse(string $proxy): array
    {
        $p = explode(':', $proxy);
        return ['host' => $p[0] ?? null, 'port' => $p[1] ?? null, 'username' => $p[2] ?? null, 'password' => $p[3] ?? null];
    }

    public static function test(string $proxyUrl): array
    {
        $start = microtime(true);
        try {
            $res = Http::withOptions(['proxy' => $proxyUrl])->timeout(5)->get('https://api.ipify.org?format=json');
            return ['status' => $res->successful() ? 'WORKING' : 'DEAD', 'latency' => round((microtime(true) - $start) * 1000), 'ip' => $res->json('ip')];
        } catch (\Exception $e) {
            return ['status' => 'DEAD', 'latency' => null, 'ip' => null];
        }
    }
}
