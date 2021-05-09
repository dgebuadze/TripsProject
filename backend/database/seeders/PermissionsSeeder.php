<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $userPermissions = [
            'view_trips_own',
            'add_trips',
            'edit_trips_own',
            'delete_trips_own',
            'view_profile',
            'edit_profile',
            'view_trip_full'
        ];

        $managerPermissions = array_merge($userPermissions, [
            'view_users',
            'add_users',
            'add_managers',
            'edit_users',
            'delete_users',
            'edit_roles'
        ]);

        $adminPermissions = array_merge($managerPermissions, [
            'add_admins',
            'edit_managers',
            'delete_managers',
            'view_trips',
            'delete_trips',
            'edit_trips'
        ]);


        //Truncate all Roles
        Role::truncate();
        Permission::truncate();

        $userRole = Role::create(['id' => 1, 'guard_name' => 'api', 'name' => 'user']);
        $managerRole = Role::create(['id' => 2, 'guard_name' => 'api', 'name' => 'manager']);
        $adminRole = Role::create(['id' => 3, 'guard_name' => 'api', 'name' => 'admin']);


        foreach ($userPermissions as $name) {
            $permission = Permission::where('name', $name)->first();
            if (!$permission) {
                $permission = Permission::create(['guard_name' => 'api', 'name' => $name]);
            }
            $userRole->givePermissionTo($permission);
        }

        foreach ($managerPermissions as $name) {
            $permission = Permission::where('name', $name)->first();
            if (!$permission) {
                $permission = Permission::create(['guard_name' => 'api', 'name' => $name]);
            }
            $managerRole->givePermissionTo($permission);
        }

        foreach ($adminPermissions as $name) {
            $permission = Permission::where('name', $name)->first();
            if (!$permission) {
                $permission = Permission::create(['guard_name' => 'api', 'name' => $name]);
            }
            $adminRole->givePermissionTo($permission);
        }
    }
}
