<?php

namespace App\Http\Controllers;

use App\Http\Requests\TripStoreRequest;
use App\Http\Requests\TripUpdateRequest;
use App\Http\Resources\TripCollection;
use App\Models\Trip;
use App\Repositories\Trip\TripRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Http\Resources\Trip as TripResource;
use Illuminate\Http\Response;

class TripController extends Controller
{
    private TripRepository $tripRepository;

    /**
     * UserController constructor.
     * @param TripRepository $tripRepository
     */
    public function __construct(TripRepository $tripRepository)
    {
        $this->tripRepository = $tripRepository;
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
        $this->authorize('viewOwn', Trip::class);

        $trips = $this->tripRepository->all($request,$request->user()->id);
        $tripsCollection = new TripCollection($trips);

        if($tripsCollection instanceof ResourceCollection){
            return $tripsCollection->additional(['success' => 1])->response()->setStatusCode(200);
        }

        return response()->json(['success' => 1, 'data' => $tripsCollection], 200);

    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function getAllTrips(Request $request)
    {
        $this->authorize('viewOwn', Trip::class);

        $trips = $this->tripRepository->all($request);
        $tripsCollection = new TripCollection($trips);

        if($tripsCollection instanceof ResourceCollection){
            return $tripsCollection->additional(['success' => 1])->response()->setStatusCode(200);
        }

        return response()->json(['success' => 1, 'data' => $tripsCollection], 200);

    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function getNextMonthTrips(Request $request)
    {
        $this->authorize('viewOwn', Trip::class);

        $trips = $this->tripRepository->getNextMonthTrips($request);
        $tripsCollection = new TripCollection($trips);

        if($tripsCollection instanceof ResourceCollection){
            return $tripsCollection->additional(['success' => 1])->response()->setStatusCode(200);
        }

        return response()->json(['success' => 1, 'data' => $tripsCollection], 200);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TripStoreRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(TripStoreRequest $request)
    {
        $this->authorize('create', Trip::class);
        $trip = $this->tripRepository->create($request);

        $tripCollection = new Trip($trip->toArray());

        return response()->json(['success' => 1, 'data' => $tripCollection], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Trip $trip
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function show(Trip $trip)
    {
        $this->authorize('view', $trip);
        return response()->json(['success' => 1, 'data' => new TripResource($trip)], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TripUpdateRequest $request
     * @param Trip $trip
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(TripUpdateRequest $request, Trip $trip)
    {
        $this->authorize('update', $trip);
        $response = $this->tripRepository->update($trip, $request);

        if($response instanceof JsonResponse){
            return $response;
        }

        return response()->json(['success' => 1, 'data' => new TripResource($response)], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Trip $trip
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(Trip $trip)
    {
        $this->authorize('delete', $trip);
        $this->tripRepository->delete($trip);
        return response()->noContent();
    }
}
