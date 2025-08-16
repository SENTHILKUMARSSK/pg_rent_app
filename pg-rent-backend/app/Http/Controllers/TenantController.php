<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $query = Tenant::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('room_number')) {
            $query->where('room_number', $request->room_number);
        }

        if ($request->has('rent_status')) {
            $query->where('rent_status', $request->rent_status);
        }

        if ($request->has('rent_amount')) {
            $query->where('rent_amount', $request->rent_amount);
        }

        if ($request->has('due_date')) {
            $query->whereDate('due_date', $request->due_date);
        }

        // return response()->json($query->get());
        return Tenant::where('owner_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'owner_id' => 'required|exists:owners,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'room_number' => 'required|string|max:50',
            'rent_status' => 'required|string|in:Paid,Unpaid',
            'rent_amount' => 'nullable|numeric',
            'due_date' => 'nullable|date',
        ]);

        $tenant = Tenant::create($validated);

        return response()->json($tenant, 201);
    }

    public function update(Request $request, $id)
    {
        $tenant = Tenant::where('id', $id)->where('owner_id', Auth::id())->firstOrFail();
        $tenant->update($request->all());
        return response()->json($tenant);
    }

    public function destroy($id)
    {
        $tenant = Tenant::where('id', $id)->where('owner_id', Auth::id())->firstOrFail();
        $tenant->delete();
        return response()->json(['message' => 'Tenant deleted']);
    }
}
