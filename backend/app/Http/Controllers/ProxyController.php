<?php

namespace App\Http\Controllers;

use App\Models\Proxy;
use App\Services\ProxyEngine;
use Illuminate\Http\Request;

class ProxyController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->proxies);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check proxy limits based on plan
        $plan = $user->plan;
        $maxProxies = $plan ? $plan->max_proxies : 5; // Default 5 for free tier if no plan
        
        if ($user->proxies()->count() >= $maxProxies) {
            return response()->json([
                'error' => 'Proxy limit reached', 
                'message' => "Your current plan limits you to $maxProxies proxies. Please upgrade to add more."
            ], 403);
        }

        $request->validate(['raw_proxy' => 'required|string']);
        
        $parsed = ProxyEngine::parse($request->raw_proxy);
        
        $proxy = $request->user()->proxies()->create([
            'ip_address' => $parsed['host'],
            'port' => $parsed['port'],
            'username' => $parsed['username'],
            'password' => $parsed['password'],
            'status' => 'unknown',
        ]);

        return response()->json($proxy, 201);
    }

    public function test(Request $request, Proxy $proxy)
    {
        if ($proxy->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $auth = $proxy->username ? "{$proxy->username}:{$proxy->password}@" : "";
        $url = "http://{$auth}{$proxy->ip_address}:{$proxy->port}";

        $result = ProxyEngine::test($url);

        $proxy->update(['status' => $result['status']]);

        return response()->json($result);
    }

    public function destroy(Request $request, Proxy $proxy)
    {
        if ($proxy->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $proxy->delete();
        return response()->json(null, 204);
    }
}
