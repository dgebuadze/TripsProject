<?php

namespace App\Policies;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Role;

class TripPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->can('view_trips');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param Trip $model
     * @return mixed
     */
    public function view(User $user, Trip $model)
    {
        return $user->can('view_trips') || ($user->can('view_trips_own') && $user->id === $model->user_id);
    }

    /**
     * Determine whether the user can view his own models.
     *
     * @param User $user
     * @return mixed
     */
    public function viewOwn(User $user)
    {
        return $user->can('view_trips_own');
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->can('add_trips');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param Trip $model
     * @return mixed
     */
    public function update(User $user, Trip $model)
    {
        return $user->can('edit_trips') || ($user->can('edit_trips_own') && $user->id === $model->user_id);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param Trip $model
     * @return mixed
     */
    public function delete(User $user, Trip $model)
    {
        return $user->can('delete_trips') || ($user->can('delete_trips_own') && $user->id === $model->user_id);
    }

    /**
     * Determine whether the user can view current time of trip
     *
     * @param User $user
     * @param Trip $model
     * @return mixed
     */
    public function viewTime(User $user, Trip $model)
    {
        return $user->can('view_trip_full') &&
            ($user->can('view_trips') || ($user->can('view_trips_own') && $user->id === $model->user_id));
    }


}
