<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/pantalla_principal', function () {
    return response()->file(public_path('Pantalla_principal/index_pantalla_principal.html'));
});
