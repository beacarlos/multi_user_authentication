<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::group(['middleware' => ['admin']], function () {
    Route::group(['prefix' => 'admin'], function () {
        Route::middleware('auth:admin')->group(function () {
            Route::get('/', 'AdminControlador@index');
            Route::get('/logout', 'AdminControlador@logout');
        });
        Route::get('/login', 'AdminControlador@login');
        Route::post('/login', 'AdminControlador@postLogin');
    });
});

Auth::routes();
