<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Owner;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:owners',
            'password' => 'required|min:6',
        ]);

        $owner = Owner::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $token = $owner->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token], 201);
    }

    public function login(Request $request) {
        $owner = Owner::where('email', $request->email)->first();

        if (!$owner || !Hash::check($request->password, $owner->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $owner->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token,'owner_id' => $owner->id,]);
    }

    public function forgotPassword(Request $request) {
        return response()->json(['message' => 'Forgot password feature coming soon']);
    }
}
