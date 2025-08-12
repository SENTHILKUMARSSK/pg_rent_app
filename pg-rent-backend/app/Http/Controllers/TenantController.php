<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;

class TenantController extends Controller
{
    public function index()
    {
        return Tenant::where('owner_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $tenant = Tenant::create([
            'owner_id' => Auth::id(),
            'name' => $request->name,
            'phone' => $request->phone,
            'room_number' => $request->room_number,
            'rent_status' => $request->rent_status ?? 'Unpaid',
        ]);
        return response()->json($tenant);
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
