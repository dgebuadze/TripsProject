<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'guest'], function () {
    Route::post('auth/register', 'AuthController@register');
});

Route::group(['middleware' => 'auth:api'], function () {

    Route::resource('users', 'UserController');
    Route::resource('users.trips', 'UserTripController', ['only' => ['index']]);

    Route::get('trips/all', 'TripController@getAllTrips');
    Route::get('trips/next-month', 'TripController@getNextMonthTrips');
    Route::resource('trips', 'TripController', ['except' => ['create', 'edit']]);


    Route::post('auth/logout', 'AuthController@logout');
    Route::get('auth/me', 'AuthController@me');
});
