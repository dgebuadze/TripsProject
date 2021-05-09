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

    private $tripRepository;

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

    /**
     * Update the specified resource in storage.
     *
     * @param User $user
     * @param Timezone $timezone
     * @return JsonResponse
     */
    public function update(User $user, Timezone $timezone)
    {
        $timezone->user_id = $user->id;
        $timezones = $user->timezones;
        return 1;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @param Timezone $timezone
     * @return Response
     */
    public function destroy(User $user, Timezone $timezone)
    {
        $this->timezoneRepository->destroy($timezone);
        return $this->emptyResponse();
    }
}
