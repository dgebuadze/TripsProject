<?php

namespace App\Repositories\User;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\ParameterBag;

class UserRepository implements UserRepositoryInterface
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function all(Request $request)
    {

        $perPage = $request->query->getInt('per_page', 30);
        $sort = $request->query->filter('sort', 'created_at');
        $order = $request->query->filter('order', 'desc');

        $sortAble = ['name', 'email', 'created_at', 'id'];
        $orderAble = ['asc', 'desc'];

        $sort = in_array($sort, $sortAble) ? $sort : 'id';
        $order = in_array($order, $orderAble) ? $order : 'desc';

        $query = User::with(['roles']);

        foreach ($request->all() as $key => $value) {
            switch ($key) {
                case "search":
                    $query->where(function ($q) use ($value) {
                        $q->where('name', 'like', '%' . $value . '%')
                            ->orWhere('email', 'like', '%' . $value . '%');
                    });
                    break;

                case "role":
                    $roles = explode(",", $request->query->get('role'));
                    $query = $query->whereHas('roles', function ($q) use ($roles) {
                        $q->whereIn('name', $roles);
                    });
                    break;
            }
        }

        return $query->orderBy($sort, $order)->paginate($perPage)->appends($request->input());
    }


    /**
     * @param Request $request
     * @return User
     */
    public function create(Request $request)
    {
        $data = $request->only(['name', 'email', 'password']);

        $data['email_verify_token'] = hash('sha256', Str::random(40));
        $data['password_reset_token'] = hash('sha256', Str::random(40));
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);
        if ($request->role) {
            $user->assignRole(Role::find($request->role));
        } else {
            $user->assignRole(Role::find(User::$ROLE_USER));
        }
        return $user;
    }

    /**
     * @param User $user
     * @param UserUpdateRequest $request
     * @return User|JsonResponse
     */
    public function update(User $user, UserUpdateRequest $request)
    {
        $roleChanged = false;
        if ($request->has('name')) {
            $user->name = $request->input('name');
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = bcrypt($request->password);
        }

        if ($request->has('role')) {
            $role = Role::find($request->role);
            if ($role && $user->getRoleNames() !== $role->name) {
                $roleChanged = true;
                $user->syncRoles([$role]);
            }
        }

        if (!$user->isDirty() && !$roleChanged) {
            return response()->json(['success' => 0, 'error' => 'Nothing changed'], 422);
        }

        $user->save();

        return $user;
    }

    public function delete(User $user)
    {
        $user->trips()->delete();
        $user->delete();
    }
}
