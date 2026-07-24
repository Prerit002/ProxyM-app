<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proxy;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        if (!$request->user()->is_admin) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return response()->json([
            'total_users' => User::count(),
            'total_proxies' => Proxy::count(),
            'working_proxies' => Proxy::where('status', 'WORKING')->count(),
            'dead_proxies' => Proxy::where('status', 'DEAD')->count(),
        ]);
    }

    public function getUsers(Request $request)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);
        
        $users = User::withCount('proxies')->get();
        return response()->json($users);
    }

    public function toggleBlockUser(Request $request, User $user)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);
        if ($user->is_admin) return response()->json(['error' => 'Cannot block admin'], 403);

        $user->is_blocked = !$user->is_blocked;
        $user->save();

        return response()->json(['message' => 'User block status updated', 'is_blocked' => $user->is_blocked]);
    }

    public function getProxies(Request $request)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);
        
        $proxies = Proxy::with('user:id,name,email')->get();
        return response()->json($proxies);
    }

    public function purgeDeadProxies(Request $request)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);
        
        $deletedCount = Proxy::where('status', 'DEAD')->delete();
        return response()->json(['message' => "Purged $deletedCount dead proxies", 'deleted_count' => $deletedCount]);
    }
}
