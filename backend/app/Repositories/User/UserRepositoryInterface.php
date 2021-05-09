<?php
namespace App\Repositories\User;

use App\Http\Requests\UserUpdateRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\ParameterBag;

interface UserRepositoryInterface {
    public function all(Request $request);
    public function create(Request $request);
    public function update(User $user, UserUpdateRequest $request);
    public function delete(User $user);
}
