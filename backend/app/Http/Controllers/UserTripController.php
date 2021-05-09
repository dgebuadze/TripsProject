<?php

namespace App\Http\Controllers;

use App\Http\Resources\TripCollection;
use App\Models\Trip;
use App\Models\User;
use App\Repositories\Trip\TripRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;

class UserTripController extends Controller
{

    private TripRepositoryInterface $tripRepository;

    /**
     * UserTripController constructor.
     * @param TripRepositoryInterface $tripRepository
     */
    public function __construct(TripRepositoryInterface $tripRepository)
    {
        $this->tripRepository = $tripRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function index(Request $request, User $user)
    {
        $this->authorize('viewOwn', Trip::class);

        if ($request->user()->id !== $user->id) {
            $this->authorize('viewAny', Trip::class);
        }
        $trips = $this->tripRepository->all($request, $user->id);
        $tripsCollection = new TripCollection($trips);

        if($tripsCollection instanceof ResourceCollection){
            return $tripsCollection->additional(['success' => 1])->response()->setStatusCode(200);
        }

        return response()->json(['success' => 1, 'data' => $tripsCollection], 200);
    }
}
