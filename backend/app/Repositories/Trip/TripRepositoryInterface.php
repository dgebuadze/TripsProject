<?php
namespace App\Repositories\Trip;

use App\Http\Requests\TripUpdateRequest;
use App\Models\Trip;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\ParameterBag;

interface TripRepositoryInterface {
    public function all(Request $request, $user_id);
    public function create(Request $request);
    public function update(Trip $trip, TripUpdateRequest $request);
    public function delete(Trip $user);
}
