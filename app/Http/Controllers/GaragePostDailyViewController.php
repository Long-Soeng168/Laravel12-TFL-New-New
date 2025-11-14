<?php

namespace App\Http\Controllers;

use App\Models\GaragePostDailyView;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class GaragePostDailyViewController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:garage view', only: ['index', 'show', 'all_page_categories', 'export']),
            new Middleware('permission:garage create', only: ['create', 'store']),
            new Middleware('permission:garage update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:garage delete', only: ['destroy', 'destroy_image']),
        ];
    }
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'view_date');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $from_date = $request->input('from_date', null);
        $to_date = $request->input('to_date', null);


        $from_date = $from_date
            ? Carbon::parse($from_date)->setTimezone('Asia/Bangkok')->startOfDay()->toDateString()
            : Carbon::now()->setTimezone('Asia/Bangkok')->startOfYear()->toDateString();
        $to_date = $to_date
            ? Carbon::parse($to_date)->setTimezone('Asia/Bangkok')->endOfDay()->toDateString()
            : now()->endOfDay()->toDateString();

        $query = GaragePostDailyView::query();


        if ($from_date) {
            // dd($from_date);
            $query->where('view_date', '>=', $from_date);
        }

        if ($to_date) {
            $query->where('view_date', '<=', $to_date);
        }

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        $query->with('post');

        if ($search) {
            $query->whereHas('post', function ($subQuery) use ($search) {
                $subQuery->where('title', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);
        $totalViews = $query->sum('view_counts');

        return Inertia::render('admin/post_view_counts/Index', [
            'tableData' => $tableData,
            'totalViews' => $totalViews,
            'from_date' => $from_date,
            'to_date' => $to_date,
        ]);
    }

    public function export(Request $request)
    {
        // dd($request->all());
        $from_date = $request->input('from_date', null);
        $to_date = $request->input('to_date', null);

        $from_date = $from_date
            ? Carbon::parse($from_date)->setTimezone('Asia/Bangkok')->startOfDay()->toDateString()
            : Carbon::now()->setTimezone('Asia/Bangkok')->startOfYear()->toDateString();
        $to_date = $to_date
            ? Carbon::parse($to_date)->setTimezone('Asia/Bangkok')->endOfDay()->toDateString()
            : now()->endOfDay()->toDateString();
        dd($from_date, $to_date);

        $filters = [
            'search' => $request->input('search', ''),
            'status' => $request->input('status'),
            'sortBy' => $request->input('sortBy', 'view_date'),
            'sortDirection' => $request->input('sortDirection', 'desc'),
            'from_date' => $from_date,
            'to_date' => $to_date,
        ];



        // return Excel::download(new PostDailyViewExport($filters), 'post_views.xlsx');
    }
}
