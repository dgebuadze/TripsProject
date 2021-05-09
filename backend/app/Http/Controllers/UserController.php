<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;
use App\Models\User;
use App\Repositories\User\UserRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Psy\Util\Json;
use Symfony\Component\HttpFoundation\ParameterBag;

class UserController extends Controller
{
    private UserRepository $userRepository;

    /**
     * UserController constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $users = $this->userRepository->all($request);
        $usersCollection = new UserCollection($users);

        if($usersCollection instanceof ResourceCollection){
            return $usersCollection->additional(['success' => 1])->response()->setStatusCode(200);
        }

        return response()->json(['success' => 1, 'data' => $usersCollection], 200);


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param UserStoreRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);

        $user = $this->userRepository->create($request);

        return response()->json(['success' => 1, 'data' => $user], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        return response()->json(['success' => 1, 'data' => $user], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UserUpdateRequest $request
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $this->authorize('update', $user);
        $response = $this->userRepository->update($user, $request);

        if($response instanceof JsonResponse){
            return $response;
        }

        return response()->json(['success' => 1, 'data' => $response], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $this->userRepository->delete($user);

        return response()->noContent();
    }

}
