<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function getPlans()
    {
        // Return all available plans
        return response()->json(Plan::all());
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);

        $user = $request->user();
        $user->plan_id = $request->plan_id;
        $user->save();

        return response()->json(['message' => 'Successfully subscribed to plan', 'user' => $user->load('plan')]);
    }
}
