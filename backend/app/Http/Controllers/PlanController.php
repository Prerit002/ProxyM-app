<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);
        
        return response()->json(Plan::all());
    }

    public function store(Request $request)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'max_proxies' => 'required|integer'
        ]);

        $plan = Plan::create($request->only('name', 'price', 'max_proxies'));

        return response()->json($plan, 201);
    }

    public function destroy(Request $request, Plan $plan)
    {
        if (!$request->user()->is_admin) return response()->json(['error' => 'Forbidden'], 403);
        
        $plan->delete();
        return response()->json(['message' => 'Plan deleted']);
    }
}
