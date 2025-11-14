<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RuleLibraryController extends Controller
{
    public function index(){
        return Inertia::render('rule-library/Index');
    }
}
