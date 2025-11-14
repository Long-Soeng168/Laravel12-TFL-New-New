<?php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Helpers\TelegramHelper;
use App\Models\CareerSubmit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CareerSubmitController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:team view', only: ['index', 'show']),
            new Middleware('permission:team delete', only: ['destroy']),
        ];
    }
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = CareerSubmit::query();

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->with('career', 'position')->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/career_submits/Index', [
            'tableData' => $tableData,
        ]);
    }
    public function destroy(CareerSubmit $career_submit)
    {
        $career_submit->delete();
        return redirect()->back()->with('success', 'Message deleted successfully.');
    }
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name'          => 'nullable|string|max:255',
            'phone'         => 'required|string|min:8|max:20',
            'email'         => 'nullable|email|max:255',
            'cv_file'       => 'nullable|file|mimes:pdf|max:12120', // assuming file upload for CV
            'position_code' => 'required|string|exists:positions,code',
            'career_id'     => 'required|integer|exists:careers,id',
        ]);

        $cv_file = $request->file('cv_file');
        unset($validated['cv_file']);

        if ($cv_file) {
            try {
                $created_file_name = FileHelper::uploadFile($cv_file, 'assets/files/career_submits', true);
                if ($created_file_name) {
                    $validated['cv_file'] = $created_file_name;
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload file: ' . $e->getMessage());
            }
        }

        try {
            DB::beginTransaction();

            // Create message
            $career_submit = CareerSubmit::create($validated);

            DB::commit();

            // $result = TelegramHelper::sendMessage($career_submit);
            // if ($result['success']) {
            //     return back()->with('success', 'Message placed successfully!');
            // } else {
            //     return back()->with('error', $result['message']);
            // }
            return back()->with('success', 'Submit successfully!');
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'general' => 'Failed to submit. ' . $e->getMessage()
            ]);
        }
    }
}
