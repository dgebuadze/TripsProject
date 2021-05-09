<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterStoreRequest;
use App\Http\Resources\User as UserResource;
use App\Repositories\User\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    private $userRepository;

    /**
     * AuthController constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Register a new user
     *
     * @param RegisterStoreRequest $request
     * @return JsonResponse
     */
    public function register(RegisterStoreRequest $request)
    {
        $user = $this->userRepository->create($request);

        return response()->json([
            'success' => 1,
            'data' => $user
        ], 201);
    }

    /**
     * @param Request $request
     *
     * Return authenticated user with role
     *
     * @return JsonResponse
     */
    public function me(Request $request)
    {
        $user = $request->user();

        $userRole = $user->roles;

        $user['role'] = $userRole->pluck('name')->first();
        $user['role_id'] = $userRole->pluck('id')->first();

        $allowed_keys = ['id', 'full_name', 'verified', 'email', 'created_at', 'role', 'role_id'];

        return response()->json(['success' => 1, 'data' => $user->only($allowed_keys)], 200);
    }

    /**
     * Log out existing user
     *
     * @return Response
     */
    public function logout()
    {
        if (Auth::check()) {
            Auth::user()->oauthAccessToken()->delete();
        }

        return null;
    }
}
