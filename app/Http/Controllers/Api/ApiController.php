<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Carbon;

class ApiController extends Controller
{
    //
    public function register(Request $request){
        // data validation
        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users",
            "password" => "required|confirmed"
        ]);

        User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password)
        ]);
        return response()->json([
            "status" => true,
            "message" => "User registered successfully"
        ]);

    }

    public function login(Request $request){
         // data validation
         $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
        $expirationTime = Carbon::now()->addMinutes(2);
        $refreshExpirationTime = Carbon::now()->addHours(20);
        $token = JWTAuth::attempt([
            "email" => $request->email,
            "password" => $request->password
        ],
        [
            'exp' => $expirationTime->timestamp,
        ]);
        
        if(!empty($token)){
            $refreshToken = JWTAuth::fromUser(auth()->user(),
            [
                'exp' => $refreshExpirationTime->timestamp,
            ]);

            return response()->json([
                "status" => true,
                "message" => "User logged in succcessfully",
                "token" => $token,
                "refresh_token" => $refreshToken,
                "expires_at" => $expirationTime->toDateTimeString()
            ]);
        }
        return response()->json([
            "status" => false,
            "message" => "Invalid Login Details"
        ]);


    }

    public function profile(){
        $userdata = auth()->user();

        return response()->json([
            "status" => true,
            "message" => "Profile data",
            "data" => $userdata
        ]);

    }

    public function refreshToken(){
        $newToken = auth()->refresh();

        return response()->json([
            "status" => true,
            "message" => "New access token",
            "token" => $newToken
        ]);

    }

    public function logout(){
        auth()->logout();

        return response()->json([
            "status" => true,
            "message" => "User logged out successfully"
        ]);
        
    }

}
