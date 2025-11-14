<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Project Route
    Route::resource('api/file_manager/files', FileController::class); 
    Route::resource('api/file_manager/folders', FolderController::class); 

});
