<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::truncate();
        User::flushEventListeners();
        User::factory()->count(10)->create();

        $roles = Role::where('name', '<>', 'admin')
            ->get();

        foreach (User::all() as $user) {
            if ($user->id === 1) {
                $user->update(["email" => "admin@trips.test"]);
                $user->assignRole(Role::findByName('admin', 'api'));
            } else if ($user->id === 2) {
                $user->update(["email" => "manager@trips.test"]);
                $user->assignRole(Role::findByName('manager', 'api'));
            } else if ($user->id === 3) {
                $user->update(["email" => "user@trips.test"]);
                $user->assignRole(Role::findByName('user', 'api'));
            } else {
                $randomRole = $roles->shuffle()->first();
                $user->assignRole($randomRole);
            }
        }
    }
}
