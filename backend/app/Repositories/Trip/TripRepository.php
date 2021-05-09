<?php

namespace App\Repositories\Trip;

use App\Http\Requests\TripUpdateRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\ParameterBag;

class TripRepository implements TripRepositoryInterface
{

    /**
     * @param Request $request
     * @param null $user_id
     * @return mixed
     */
    public function all(Request $request, $user_id = null)
    {

        $perPage = $request->query->getInt('per_page', 30);
        $sort = $request->query->filter('sort', 'id');
        $order = $request->query->filter('order', 'desc');

        $sortAble = ['destination', 'start_at', 'end_at', 'comment', 'created_at', 'id'];
        $orderAble = ['asc', 'desc'];

        $sort = in_array($sort, $sortAble) ? $sort : 'id';
        $order = in_array($order, $orderAble) ? $order : 'desc';

        $query = Trip::with(['roles']);

        if ($user_id !== null) {
            $query->where('user_id', $user_id);
        }

        foreach ($request->all() as $key => $value) {
            switch ($key) {
                case "search":
                    $query->where(function ($q) use ($value) {
                        $q->where('destination', 'like', '%' . $value . '%')
                            ->orWhere('comment', 'like', '%' . $value . '%');
                    });
                    break;

                case "date_from":
                    $query->where("start_at",'>=',$value);
                    break;
                case "date_to":
                    $query->where("start_at",'<=',$value);
                    break;
            }
        }

        return $query->orderBy($sort, $order)->paginate($perPage);
    }


    /**
     * @param Request $request
     * @return mixed
     */
    public function getNextMonthTrips(Request $request)
    {

        $query = Trip::with(['roles'])
            ->where('user_id', $request->user()->id)
            ->whereRaw('MONTH(start_at) = MONTH(CURDATE() + INTERVAL 1 MONTH)');

        return $query->get();
    }


    /**
     * @param Request $request
     * @return User
     */
    public function create(Request $request)
    {
        $data = $request->only(['destination', 'comment', 'start_end_date','user_id']);

        $dates = $request->input('start_end_date');


        $start_at = Carbon::parse($dates[0]);
        $end_at = Carbon::parse($dates[1]);

        $create = [
            "destination" => $request->input('destination'),
            "comment" => $request->input('comment'),
            "start_at" => $start_at,
            "user_id" => $request->user()->id,
            "end_at" => $end_at,
        ];

        if($request->has('user_id') && $request->user()->hasRole(User::$ROLE_ADMIN)){
            $create["user_id"] = $request->input('user_id');
        }

        return Trip::create($create);
    }

    /**
     * @param Trip $trip
     * @param TripUpdateRequest $request
     * @return Trip|JsonResponse
     */
    public function update(Trip $trip, TripUpdateRequest $request)
    {
        if ($request->has('destination')) {
            $trip->destination = $request->destination;
        }
        if ($request->has('comment')) {
            $trip->comment = $request->comment;
        }
        if ($request->has('start_end_date')) {
            $dates = $request->input('start_end_date');

            $start_at = Carbon::parse($dates[0]);
            $end_at = Carbon::parse($dates[1]);
            $trip->start_at = $start_at;
            $trip->end_at = $end_at;
        }

        if (!$trip->isDirty()) {
            return response()->json(['success' => 0, 'error' => 'Nothing changed'], 422);
        }

        $trip->save();

        return $trip;
    }

    public function delete(Trip $trip)
    {
        $trip->delete();
    }
}
